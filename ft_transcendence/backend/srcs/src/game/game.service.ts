import { Socket } from "socket.io";
import Matter, { Events } from "matter-js";

class GameModel{
    private _engine: Matter.Engine;
    private _world: Matter.World;
    width: number = 600;
    height: number = 800;
    walls: Matter.Body[] = [];
    ball: Matter.Body | null = null;
    player1: Matter.Body | null = null;
    player2: Matter.Body | null = null;
    socket1: Socket | null = null;
    socket2: Socket | null = null;

    // this id is the id of the user in the database, not the socket id.
    id1: string | null = null;
    id2: string | null = null;

    constructor(socket: Socket){
        this.socket1 = socket;
        console.log("Game constructor");
        this.id1 = socket.id;
        this._engine = Matter.Engine.create({gravity: {x: 0, y: 0}});
        this._world = this._engine.world;
        this._createWalls();
        this._createBall();
        this._createPlayers();
        this._setEvents();
    }

    private _createWalls(): void{
        this.walls = [
            Matter.Bodies.rectangle(this.width / 2, 0, this.width, 10, {isStatic: true}),
            Matter.Bodies.rectangle(this.width / 2, this.height, this.width, 10, {isStatic: true}),
            Matter.Bodies.rectangle(0, this.height / 2, 10, this.height, {isStatic: true}),
            Matter.Bodies.rectangle(this.width, this.height / 2, 10, this.height, {isStatic: true})
        ];
        Matter.World.add(this._world, this.walls);
    }

    private _createBall(): void{
        this.ball = Matter.Bodies.circle(this.width / 2, this.height / 2, 10, {mass: 60, restitution: 1, force: {x: 1, y: 1}, friction: 0, frictionAir: 0, frictionStatic: 0, inertia: Infinity});
        Matter.World.add(this._world, this.ball);
    }

    private _createPlayers(): void{
        this.player1 = Matter.Bodies.rectangle(this.width / 2, this.height - 50, 100, 10, {isStatic: true});
        this.player2 = Matter.Bodies.rectangle(this.width / 2, 50, 100, 10, {isStatic: true})
        Matter.World.add(this._world, [this.player1, this.player2]);
    }

    private _setEvents(): void{
        Events.on(this._engine, 'beforeUpdate', () => {
            this.socket1.emit('GameState', {ball: this.ball.position, player1: this.player1.position, player2: this.player2.position});
            this.socket2?.emit('GameState', {ball: this._reverseVector(this.ball.position), player1: this._reverseVector(this.player1.position), player2: this._reverseVector(this.player2.position)});
        });
    }

    private _reverseVector(vector: Matter.Vector): Matter.Vector{
        return Matter.Vector.create(this.width - vector.x, this.height - vector.y);
    }

    public setSocket2(socket: Socket): void{
        this.socket2 = socket;
    }

    public setID2(id: string): void{
        this.id2 = id;
    }
}

export default GameModel;