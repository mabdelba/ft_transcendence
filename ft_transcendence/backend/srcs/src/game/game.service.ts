import { Socket } from "socket.io";
import Matter, { Bodies, Engine, Events, Runner, Vector, World, Body } from "matter-js";

class GameModel{
    private _engine: Engine;
    private _world: World;
    private _runner: Runner;
    width: number = 600;
    height: number = 800;
    xForce: number = 0;
    yForce: number = 0;
    gameStarted: boolean = false;
    walls: Body[] = [];
    ball: Body | null = null;
    player1: Body | null = null;
    player2: Body | null = null;
    player1Score: number = 0;
    player2Score: number = 0;
    socket1: Socket | null = null;
    socket2: Socket | null = null;

    // this id is the id of the user in the database, not the socket id.
    id1: string | null = null;
    id2: string | null = null;

    constructor(socket: Socket){
        this.socket1 = socket;
        this.id1 = socket.id;
        console.log("Game constructor");
        this._runner = Runner.create();
        this._engine = Engine.create({gravity: {x: 0, y: 0}});
        this._world = this._engine.world;
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
        this.ball = Bodies.circle(this.width / 2, this.height / 2, 10, {mass: 60, restitution: 1, force: {x: 1.34, y: 1.34}, friction: 0, frictionAir: 0, frictionStatic: 0, inertia: Infinity, label: "ball"});
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
                    this.ball.position.x = this.width / 2;
                    this.ball.position.y = this.height / 2;
                    this.player2Score++;
                    this.socket1?.emit('Score', {player1: this.player1Score, player2: this.player2Score});
                    this.socket2?.emit('Score', {player2: this.player2Score, player1: this.player1Score});
                    this.socket1?.emit('startBotton');
                    this.gameStarted = false;
                }
                else if ((pair.bodyA.label == "ball" && pair.bodyB.label == "bottomWall") || (pair.bodyB.label == "ball" && pair.bodyA.label == "bottomWall"))
                {
                    this.ball.position.x = this.width / 2;
                    this.ball.position.y = this.height / 2;
                    World.remove(this._world, this.ball);
                    this.player1Score++;
                    this.socket1?.emit('startBotton');
                    this.socket1?.emit('Score', {player1: this.player1Score, player2: this.player2Score});
                    this.socket2?.emit('Score', {player2: this.player2Score, player1: this.player1Score});
                    this.gameStarted = false;
                }
                if(this.player1Score == 10)
                    this.socket2?.emit('endGame');
                else if(this.player2Score == 10)
                    this.socket1?.emit('endGame');
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

//run this function when the game starts
    // public run(): void{
    //     console.log("run");
        
    // }
    public spawnBall(): void{
        if(!this.gameStarted){
            this.gameStarted = !this.gameStarted;
            this._createBall();
            World.add(this._world, this.ball);
        }
    }
//destroy this function when the game ends
    public destroy(): void{
        console.log("destroy");
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