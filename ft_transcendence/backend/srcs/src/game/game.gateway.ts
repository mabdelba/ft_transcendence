import { continueStatement } from "@babel/types";
import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import jwtDecode from "jwt-decode";
import { Socket } from "socket.io";
import { JwtGuard } from "src/auth/guards";
import GameModel from "./game.service";

@WebSocketGateway(3001, { cors: '*' })
export class GameGateway {
    ConnectedUsers: Map<string, string[]> = new Map<string, string[]>();
    RandomGames: { game: GameModel, id1: string, id2: string, map: string }[] = [];
    constructor() {}

    @UseGuards(JwtGuard)
    handleConnection(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        if (this.ConnectedUsers.has(decoded['login'])) {
            // this.ConnectedUsers.get(decoded['login'])?.push(socket.id);
            socket.disconnect();
            // console.log('already connected', decoded['login']);
        }
        else{
            this.ConnectedUsers.set(decoded['login'], [socket.id]);
            console.log('connected', decoded['login']);
        }
    }

    @SubscribeMessage('NewGame')
    handleNewGame(@ConnectedSocket() socket: Socket, @MessageBody() data: { map: string }) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        const index = this.RandomGames.findIndex((game) => game.map == data.map);
        if (index >= 0){
            const game = this.RandomGames[index];
            game.game.setSocket2(socket);
            game.id2 = socket.id;
            game.game.setID2(game.id2);
        }else{
            let game: GameModel = new GameModel(socket);
            this.RandomGames.push({game: game, id1: socket.id, id2: '', map: data.map});
        }
    }

    @SubscribeMessage('StartGame')
    handleStartGame(@ConnectedSocket() socket: Socket, @MessageBody() data: { map: string }) {
        const index = this.RandomGames.findIndex((game) => (game.id1 == socket.id && game.id2 != '') || (game.id2 == socket.id));
        if (index >= 0){
            const game: GameModel = this.RandomGames[index].game;
            game.run();
            game.socket1?.emit('StartGame', {data: 'started'});
            game.socket2?.emit('StartGame', {data: 'started'});
        }
    }

    @SubscribeMessage('MovePlayer')
    handleMovePlayer(@ConnectedSocket() socket: Socket, @MessageBody() data: { x: number}) {
        const index = this.RandomGames.findIndex((game) => (game.id1 == socket.id || game.id2 == socket.id));
        if (index >= 0){
            const game: GameModel = this.RandomGames[index].game;
            console.log(socket.id, data.x);
            game.movePlayer(socket.id, data.x);
        }
    }

    @UseGuards(JwtGuard)
    handleDisconnect(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        let ids = this.ConnectedUsers.get(decoded['login']);
        const index = ids?.indexOf(socket.id);
        if (index >= 0)
            ids.splice(index!, 1);
        console.log("ids", ids);
        if (ids?.length == 0){
            this.ConnectedUsers.delete(decoded['login']);
            const index = this.RandomGames.findIndex((game) => game.id1 == socket.id || game.id2 == socket.id);
            if (index >= 0){
                const game: GameModel = this.RandomGames[index].game;
                game.socket1?.emit('left', {data: 'your opponent left'});
                game.socket2?.emit('left', {data: 'your opponent left'});
                if (game.socket1?.id == socket.id)
                    game.socket2?.disconnect();
                else
                    game.socket1?.disconnect();
                this.RandomGames.splice(index, 1);
            }
        }
        console.log("GameGateway handleDisconnect", socket.id);
    }
}