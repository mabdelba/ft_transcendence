import { continueStatement } from "@babel/types";
import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import jwtDecode from "jwt-decode";
import { Socket } from "socket.io";
import { JwtGuard } from "src/auth/guards";
import GameModel from "./game.service";
import { disconnect } from "process";

@WebSocketGateway(3001, { cors: '*' })
export class GameGateway {
    ConnectedUsers: Map<string, Socket[]> = new Map<string, Socket[]>();
    RandomGames: { game: GameModel, id1: string, id2: string, map: string }[] = [];
    constructor() {}
 
    @UseGuards(JwtGuard)
    handleConnection(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        if (this.ConnectedUsers.has(login)) {
            this.ConnectedUsers.get(login)?.push(socket);
            console.log('already connected', login, socket.id);
            // socket.disconnect();
        }
        else{
            this.ConnectedUsers.set(login, [socket]);
            console.log('connected', login, socket.id);
        }
    }



    @SubscribeMessage('NewGame')
    handleNewGame(@ConnectedSocket() socket: Socket, @MessageBody() data: { map: string }) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        const index = this.RandomGames.findIndex((game) => game.map == data.map && (game.id1 !== login && game.id2 !== login));

        if (index >= 0){
            console.log("index "+ index +" "+ login +" joined game");
            const game = this.RandomGames[index];
            game.game.setSocket2(socket);
            game.game.setID2(socket.id);
            game.id2 = login;
        }else
        {
            let game: GameModel = new GameModel(socket);
            console.log( login +" created new game");
            this.RandomGames.push({game: game, id1: login, id2: '', map: data.map});
        }
    }

    @SubscribeMessage('StartGame')
    handleStartGame(@ConnectedSocket() socket: Socket, @MessageBody() data: { map: string }) {
        const index = this.RandomGames.findIndex((game) => (game.game.id1 == socket.id && game.id2 != '') || game.game.id2 == socket.id);
        if (index >= 0 && this.RandomGames[index].game.socket1.connected && this.RandomGames[index].game.socket2.connected){
            const game: GameModel = this.RandomGames[index].game;
            console.log("start game", game.id1, game.id2, this.RandomGames.length);
            game.run();
        }
    }

    @SubscribeMessage('MovePlayer')
    handleMovePlayer(@ConnectedSocket() socket: Socket, @MessageBody() data: { x: number}) {
        const index = this.RandomGames.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));
        if (index >= 0){
            const game: GameModel = this.RandomGames[index].game;
            game.movePlayer(socket.id, data.x);
        }
    }

    @UseGuards(JwtGuard)
     handleDisconnect(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const ids = this.ConnectedUsers.get(decoded['login']);
        console.log("ids", ids.length);
        //map for ids and emit game leave to all ids
        // if (ids.length > 1){
        //     const index = ids.findIndex((id) => id.id == socket.id);
        //     ids.splice(index, 1);
        //     console.log("ids", ids.length);
        // }
        // else
        //     this.ConnectedUsers.delete(decoded['login']);


        const gameIndex = this.RandomGames.findIndex((game) => game.game.id1 == socket.id || game.game.id2 == socket.id);
        this.ConnectedUsers.delete(decoded['login']);
        if (gameIndex >= 0){
            const game: GameModel = this.RandomGames[gameIndex].game;
            if (socket.id === game.socket1.id){
                console.log("here111", socket.id, game.socket2?.connected);
                // game.socket2?.disconnect();
            }
            else{
                console.log("here222", socket.id, game.socket1?.connected);
                // game.socket1?.disconnect();
            }
            game.destroy();
            this.RandomGames.splice(gameIndex, 1);
        }
        console.log("GameGateway handleDisconnect", socket.id, decoded['login']);
    }
}