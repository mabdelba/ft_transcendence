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
    walls: Body[] = [];
    ball: Body | null = null;
    player1: Body | null = null;
    player2: Body | null = null;
    socket1: Socket | null = null;
    socket2: Socket | null = null;

    // this id is the id of the user in the database, not the socket id.
    id1: string | null = null;
    id2: string | null = null;

    constructor(socket: Socket){
        this.socket1 = socket;
        console.log("Game constructor");
        this.id1 = socket.id;
        this._runner = Runner.create();
        this._engine = Engine.create({gravity: {x: 0, y: 0}});
        this._world = this._engine.world;
        this._createWalls();
        this._createBall();
        this._createPlayers();
        this._setEvents();
    }
    setForce(x: number, y: number): void{
        this.xForce = x;
        this.yForce = y;
    }

    private _createWalls(): void{
        this.walls = [
            Bodies.rectangle(this.width / 2, 0, this.width, 10, {isStatic: true}),
            Bodies.rectangle(this.width / 2, this.height, this.width, 10, {isStatic: true}),
            Bodies.rectangle(0, this.height / 2, 10, this.height, {isStatic: true}),
            Bodies.rectangle(this.width, this.height / 2, 10, this.height, {isStatic: true})
        ];
        World.add(this._world, this.walls);
    }

    private _createBall(): void{
        this.ball = Bodies.circle(this.width / 2, this.height / 2, 10, {mass: 60, restitution: 1, force: {x: 1, y: 1}, friction: 0, frictionAir: 0, frictionStatic: 0, inertia: Infinity});
        World.add(this._world, this.ball);
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
    public run(): void{
        console.log("run");
        Runner.run(this._runner, this._engine);
    }
//destroy this function when the game ends
    public destroy(): void{
        console.log("destroy");
        Runner.stop(this._runner);
        World.clear(this._world, false);
        Engine.clear(this._engine);
    }

    public movePlayer(id: string, x: number): void{
        if (id == this.id1 && this.player1)
            Body.setPosition(this.player1, {x: x, y: this.player1.position.y});
        else if (id == this.id2 && this.player2)
            Body.setPosition(this.player2, {x: this.width - x, y: this.player2.position.y});
    }
}

export default GameModel;