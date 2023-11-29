import { Socket } from "socket.io";
import Matter, { Bodies, Engine, Events, Runner, Vector, World, Body } from "matter-js";
import { PrismaService } from "src/prisma/prisma.service";
import { ForbiddenException } from "@nestjs/common";
import { getAchievementFromId } from "src/utils/get-achievement-from-id";
import { User } from "@prisma/client";
import { getUserFromLogin } from "src/utils/get-user-from-id";
import { set } from "husky";

class GameModel{
    private _engine: Engine;
    private _world: World;
    private _runner: Runner;
    width: number = 600;
    height: number = 800;
    xForce: number = 0;
    yForce: number = 0;
    gameStarted: boolean = false;
    datapost: boolean = false
    lance: boolean = true;
    walls: Body[] = [];
    ball: Body | null = null;
    player1: Body | null = null;
    player2: Body | null = null;
    player1Score: number = 0;
    player2Score: number = 0;
    socket1: Socket | null = null;
    socket2: Socket | null = null;

    // this id is the id of the user in database, not the socket id.
    id1: string | null = null;
    id2: string | null = null;
    constructor(socket: Socket, private prisma: PrismaService){
        this.socket1 = socket;
        this.id1 = socket.id;
        console.log("Game constructor");
        this._runner = Runner.create();
        this._engine = Engine.create({gravity: {x: 0, y: 0}});
        this._world = this._engine.world;
        this.setForce(1.40, 1.40)
        this._createWalls();
        this._createBall();
        this._createPlayers();
        this._setEvents();
        Runner.run(this._runner, this._engine);
    }
    
    setForce(x: number, y: number): void{
        this.xForce = x;
        this.yForce = y;
    }

    private _createWalls(): void{
        this.walls = [
            Bodies.rectangle(this.width / 2, 0, this.width, 10, {isStatic: true, label: "topWall"}),
            Bodies.rectangle(this.width / 2, this.height, this.width, 10, {isStatic: true, label: "bottomWall"}),
            Bodies.rectangle(0, this.height / 2, 10, this.height, {isStatic: true, label: "leftWall"}),
            Bodies.rectangle(this.width, this.height / 2, 10, this.height, {isStatic: true, label: "rightWall"})
        ];
        World.add(this._world, this.walls);
    }

    private _createBall(): void{
        this.ball = Bodies.circle(this.width / 2, this.height / 2, 10, {mass: 60, restitution: 1, force: {x: this.xForce, y: this.yForce}, friction: 0, frictionAir: 0, frictionStatic: 0, inertia: Infinity, label: "ball"});
        // World.add(this._world, this.ball);
    }

    private _createPlayers(): void{
        this.player1 = Bodies.rectangle(this.width / 2, this.height - 50, 100, 10, {isStatic: true});
        this.player2 = Bodies.rectangle(this.width / 2, 50, 100, 10, {isStatic: true})
        World.add(this._world, [this.player1, this.player2]);
    }

    private _setEvents(): void{
        Events.on(this._engine, 'beforeUpdate', () => {
            this.socket1.emit('GameState', {ball: this.ball?.position, player1: this.player1.position, player2: this.player2.position});
            this.socket2?.emit('GameState', {ball: this._reverseVector(this.ball?.position), player1: this._reverseVector(this.player1.position), player2: this._reverseVector(this.player2.position)});
        });
        Events.on(this._engine, 'collisionStart', (event) => {
            let pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++){
                let pair = pairs[i];
               if ((pair.bodyA.label == "ball" && pair.bodyB.label == "topWall") || (pair.bodyB.label == "ball" && pair.bodyA.label == "topWall"))
               {//need to check whois scored
                   World.remove(this._world, this.ball);
                    Body.setPosition(this.ball, {x: this.width / 2, y: this.height / 2});
                    this.lance = false;
                    this.socket1?.emit('startState');
                    this.socket2?.emit('startState');
                    this.runGame();
                    this.player1Score++;
                    this.socket1?.emit('Score', {player1: this.player1Score, player2: this.player2Score});
                    this.socket2?.emit('Score', {player1: this.player2Score, player2: this.player1Score});
                    if(this.player1Score == 10)
                        this.socket2?.emit('gameOver');
                }
                else if ((pair.bodyA.label == "ball" && pair.bodyB.label == "bottomWall") || (pair.bodyB.label == "ball" && pair.bodyA.label == "bottomWall"))
                {
                    World.remove(this._world, this.ball);
                    Body.setPosition(this.ball, {x: this.width / 2, y: this.height / 2});
                    this.lance = true;
                    this.socket1?.emit('startState');
                    this.socket2?.emit('startState');
                    this.runGame();
                    this.player2Score++;
                    this.socket1?.emit('Score', {player1: this.player1Score, player2: this.player2Score});
                    this.socket2?.emit('Score', {player1: this.player2Score, player2: this.player1Score}); 
                    if(this.player2Score == 10)
                        this.socket1?.emit('gameOver');
                    
                }

            }

        });
    }

    private _reverseVector(vector: Vector): Vector{
        return Vector.create(this.width - vector.x, this.height - vector.y);
    }

    public setSocket2(socket: Socket): void{
        this.socket2 = socket;
    }
// need to remove this funtions
    public setSocket1(socket: Socket): void{
        this.socket1 = socket;
    }
///////////////////////////////

    public setID2(id: string): void{
        this.id2 = id;
    } 

    public setGameStarted(): void{
        this.gameStarted = true;
    }
    public runGame(): void{
       
      if(this.lance)
        this.setForce(-1.40, -1.40);
      else
        this.setForce(1.40, 1.40);
      this._createBall();
          setTimeout(() => {
            World.add(this._world, this.ball);
          },3000); 
    }
//destroy this function when the game ends
    public destroy(): void{
        console.log("destroy");
        Events.off(this._engine, 'beforeUpdate', ()=> {});
        Runner.stop(this._runner);
        World.clear(this._world, true);
        Engine.clear(this._engine);
    }

    public movePlayer(id: string, x: number): void{
        if (id == this.id1 && this.player1)
            Body.setPosition(this.player1, {x: x, y: this.player1.position.y});
        else if (id == this.id2 && this.player2)
            Body.setPosition(this.player2, {x: this.width - x, y: this.player2.position.y});
    }



    async addNewGame(dto: { userLogin: string, opponentLogin: string, scoreP1: number, scoreP2: number }) {
        try {
          console.log('game added====================');
            await this.prisma.game.create({
                data: {
                    player1Login: dto.userLogin,
                    player2Login: dto.opponentLogin,
                    scoreOfPlayer1: dto.scoreP1,
                    scoreOfPlayer2: dto.scoreP2,
                    winnerLogin: dto.scoreP1 > dto.scoreP2 ? dto.userLogin : dto.opponentLogin,
                },
            });
            await this.prisma.user.update({
                where: {
                    login: dto.userLogin,
                },
                data: {
                    numberOfGamesPlayed: {
                        increment: 1,
                    }, 
                },
                }
            );
            await this.prisma.user.update({
                where: {
                    login: dto.opponentLogin,
                },
                data: {
                    numberOfGamesPlayed: {
                        increment: 1,
                    }, 
                },
                }
            );
            if(dto.scoreP1 > dto.scoreP2)
            {
                await this.prisma.user.update({
                    where: {
                        login: dto.userLogin,
                    },
                    data: {
                        numberOfGamesWon: {
                            increment: 1,
                        },
                        level: {
                            increment: 0.5,
                        },
                    },
                });
                await this.prisma.user.update({
                    where: {
                        login: dto.opponentLogin,
                    },
                    data: {
                        level: {
                            increment: 0.15,
                        },
                    },
                });
            }
            else
            {
                await this.prisma.user.update({
                    where: {
                        login: dto.opponentLogin,
                    },
                    data: {
                        numberOfGamesWon: {
                            increment: 1,
                        },
                        level: {
                            increment: 0.5,
                        }
                    },
                    });
                await this.prisma.user.update({
                    where: {
                        login: dto.userLogin,
                    },
                    data: {
                        level: {
                            increment: 0.15,
                        },
                    },
                });
            }
        }
        catch (e) {
            return { status: 'error' };
        }
    
    }
    async checkIfAchievements(userId: number, achievementId: number) {
        try{
          const checkIfAcquired = await this.prisma.achievement.findUnique({
            where: {
              id: achievementId,
            },
            select: {
              users: {
                where: {
                  id: userId,
                },
              },
            },
          });
          if (!checkIfAcquired.users[0]) {
            await this.prisma.achievement.update({
              where: {
                id: achievementId,
              },
              data: {
                users: {
                  connect: {
                    id: userId,
                  },
                },
              },
            });
            return (
              'You have acquired the achievement: ' + (await getAchievementFromId(achievementId)).name
            );
          } else
            return (
              'You already have the achievement: ' + (await getAchievementFromId(achievementId)).name
            );
        } catch (e) {
           throw new ForbiddenException('User not found')
        }
      }
    async checkIfAchievementsAcquired(userLogin: string) {
        const user = await getUserFromLogin(userLogin);
        try{
          if (user.numberOfGamesPlayed == 0) return await this.checkIfAchievements(user.id, 0);
          if (user.level < 5 && user.level > 0) return await this.checkIfAchievements(user.id, 1);
          else if (user.level < 10 && user.level >= 5) return await this.checkIfAchievements(user.id, 6);
          else if (user.level < 15 && user.level >= 10) return await this.checkIfAchievements(user.id, 7);
          else if (user.level < 22 && user.level >= 15) return await this.checkIfAchievements(user.id, 8);
          else if (user.level < 30 && user.level >= 22) return await this.checkIfAchievements(user.id, 9);
          else if (user.level < 40 && user.level >= 30)
            return await this.checkIfAchievements(user.id, 10);
          else if (user.level < 50 && user.level >= 40)
            return await this.checkIfAchievements(user.id, 11);
          else if (user.level < 55 && user.level >= 50)
            return await this.checkIfAchievements(user.id, 12);
          else if (user.level < 60 && user.level >= 55)
            return await this.checkIfAchievements(user.id, 13);
          else if (user.level < 66 && user.level >= 60)
            return await this.checkIfAchievements(user.id, 14);
          else if (user.level < 70 && user.level >= 66)
            return await this.checkIfAchievements(user.id, 15);
          else if (user.level < 77 && user.level >= 70)
            return await this.checkIfAchievements(user.id, 16);
          else if (user.level < 80 && user.level >= 77)
            return await this.checkIfAchievements(user.id, 17);
          else if (user.level < 88 && user.level >= 80)
            return await this.checkIfAchievements(user.id, 18);
          else if (user.level < 90 && user.level >= 88)
            return await this.checkIfAchievements(user.id, 19);
          else if (user.level < 99 && user.level >= 90)
            return await this.checkIfAchievements(user.id, 20);
          else if (user.level < 100 && user.level >= 99)
            return await this.checkIfAchievements(user.id, 21);
          else if (user.level == 100) return await this.checkIfAchievements(user.id, 22);
        } catch (e) {
            new ForbiddenException('User not found')
        }
      }

      async endGame(userLogin: string, opponentLogin: string, scoreP1: number, scoreP2: number) {
        await this.addNewGame({userLogin: userLogin, opponentLogin: opponentLogin, scoreP1: scoreP1, scoreP2: scoreP2});
        await this.checkIfAchievementsAcquired(userLogin);
        await this.checkIfAchievementsAcquired(opponentLogin);
      }
}

// spownBall(): void {
//     if (!this.isRunning) {
//         this.isRunning = !this.isRunning;
//         Runner.run(this.runner, this.engine);
//         return;
//     }
//     let forceX: number = -1.3;
//     let forceY: number = -1.2;
//     if (this.serve) {
//         forceX = 1.3;
//         forceY = 1.2;
//         this.serve = !this.serve;
//     } else
//         this.serve = !this.serve;
//     this.ball = Bodies.circle(this.width / 2, this.height / 2, 13, { friction: 0, restitution: 1, inertia: Infinity, density: 0.071, frictionAir: 0, force: { x: forceX, y: forceY }, label: "ball" });
//     setTimeout(() => {
//         World.add(this.world, this.ball);
//     }, 1500);
// }

export default GameModel;