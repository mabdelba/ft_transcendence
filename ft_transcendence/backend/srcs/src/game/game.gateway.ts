import { continueStatement } from "@babel/types";
import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import jwtDecode from "jwt-decode";
import { Socket } from "socket.io";
import { JwtGuard } from "src/auth/guards";
import GameModel from "./game.service";
import { disconnect } from "process";
import { subscribe } from "diagnostics_channel";

@WebSocketGateway(3001, { cors: '*' }) 
export class GameGateway {
    ConnectedUsers: Map<string, Socket[]> = new Map<string, Socket[]>();
    RandomGames: { game: GameModel, id1: string, id2: string, map: string }[] = [];
    privateGame: { game: GameModel, id1: string, id2: string, map: string}[] = [];
    constructor() {}
 
    @UseGuards(JwtGuard)
    handleConnection(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        if (this.ConnectedUsers.has(login)) {
            this.ConnectedUsers.get(login)?.push(socket);
            socket.emit('already connected');
            // console.log('geteway',socket.id)
            console.log('already connected', login, socket.id);
            // socket.disconnect();
        }
        else{
            this.ConnectedUsers.set(login, [socket]);
            console.log('connected', login, socket.id);
        }
    }


    @SubscribeMessage('NewGame')
    handleNewGame(@ConnectedSocket() socket: Socket, @MessageBody() data: { map: string, type: string, opponent?: string}) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        const index = this.RandomGames.findIndex((game) => game.map == data.map && (game.id1 !== login && game.id2 !== login));
        const check = this.RandomGames.findIndex((game) => game.id1 == login || game.id2 == login);
        const privateIndex = this.privateGame.findIndex((game) => ((game.id1 !== login && game.id2 !== login)));
        const privateCheck = this.privateGame.findIndex((game) => ((game.id1 == login || game.id2 == login)));
        console.log("new game created");
        if(data.type == 'private'){
            if (privateCheck >= 0){
                console.log("index "+ privateCheck +" "+ login +" joined private game");
                const game = this.privateGame[privateCheck];
                game.game.setSocket2(socket);
                game.game.setID2(socket.id);
                game.id2 = login;
                game.game.socket1.emit('ready');
                game.game.socket2.emit('ready');
            }else if(privateIndex < 0) 
            {
                let game: GameModel = new GameModel(socket);
                console.log(login ,"private game create for "+ data.opponent);
                this.privateGame.push({game: game, id1: login, id2: data.opponent, map: data.map});
            } 
        }
        else {
            if (index >= 0){
                console.log("index "+ index +" "+ login +" joined game");
                const game = this.RandomGames[index];
                game.game.setSocket2(socket);
                game.game.setID2(socket.id);
                game.id2 = login;
                game.game.socket1.emit('ready');
                game.game.socket2.emit('ready');
            }else if(check < 0)
            {
                let game: GameModel = new GameModel(socket);
                console.log( login +" created new game");
                this.RandomGames.push({game: game, id1: login, id2: '', map: data.map});
            }
        }
    }
    
    @SubscribeMessage('StartGame')
    handleStartGame(@ConnectedSocket() socket: Socket, @MessageBody() data: { map: string }) {
        const index = this.RandomGames.findIndex((game) => (game.game.id1 == socket.id && game.id2 != '') || game.game.id2 == socket.id);
        const privateIndex = this.privateGame.findIndex((game) => (game.game.id1 == socket.id && game.id2 != '') || game.game.id2 == socket.id);
        if (index >= 0 && this.RandomGames[index].game.socket1.connected && this.RandomGames[index].game.socket2.connected){
            const game: GameModel = this.RandomGames[index].game;
            console.log("start game", game.id1, game.id2, index);
            // game.run();
            game.spawnBall();
        }
        else if(privateIndex >= 0 && this.privateGame[privateIndex].game.socket1.connected && this.privateGame[privateIndex].game.socket2.connected){
            const game: GameModel = this.privateGame[privateIndex].game;
            console.log("start private game", game.id1, game.id2, privateIndex);
            // game.run();
            game.spawnBall();
        }
    }

    @SubscribeMessage('MovePlayer')
    handleMovePlayer(@ConnectedSocket() socket: Socket, @MessageBody() data: { x: number}) {
        const index = this.RandomGames.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));
        const privateIndex = this.privateGame.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));

        if (index >= 0){
            //check if a player disconnected and if so end the game
            //read comment in page.tsx useEffect
            const game: GameModel = this.RandomGames[index].game;
            game.movePlayer(socket.id, data.x);
        }
        else if(privateIndex >= 0){
            const game: GameModel = this.privateGame[privateIndex].game;
            game.movePlayer(socket.id, data.x);
        }
    }

    @SubscribeMessage('endGame')
    handleEndGame(@ConnectedSocket() socket: Socket) {
        const index = this.RandomGames.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));
        const privateIndex = this.privateGame.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));
        if (index >= 0){
            const game: GameModel = this.RandomGames[index].game;
            if (socket.id == game.socket2.id){
                game.socket1.emit('gameEnded', {state: 'win'});
                game.socket2.emit('gameEnded', {state: 'lose'});
            }
            else if(socket.id == game.socket1.id){
                game.socket1.emit('gameEnded', {state: 'lose'});
                game.socket2.emit('gameEnded', {state: 'win'});
            }
            this.ConnectedUsers.delete(this.RandomGames[index].id1);
            this.ConnectedUsers.delete(this.RandomGames[index].id2);
            game.destroy();
            this.RandomGames.splice(index, 1);
        }
        else if(privateIndex >= 0){
            const game: GameModel = this.privateGame[privateIndex].game;
            if (socket.id == game.socket2.id){
                game.socket1.emit('gameEnded', {state: 'win'});
                game.socket2.emit('gameEnded', {state: 'lose'});
            }
            else if(socket.id == game.socket1.id){
                game.socket1.emit('gameEnded', {state: 'lose'});
                game.socket2.emit('gameEnded', {state: 'win'});
            }
            this.ConnectedUsers.delete(this.privateGame[privateIndex].id1);
            this.ConnectedUsers.delete(this.privateGame[privateIndex].id2);
            game.destroy();
            this.privateGame.splice(privateIndex, 1);
        }
    }
    @SubscribeMessage('CancelGame')
    handleCancelGame(@ConnectedSocket() socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        const index = this.RandomGames.findIndex((game) => game.id1 == login || game.id2 == login);
        const privateIndex = this.privateGame.findIndex((game) => game.id1 == login || game.id2 == login);

        if(index >= 0){
            this.RandomGames.splice(index, 1);
        }
        else if(privateIndex >= 0){
            this.privateGame.splice(privateIndex, 1);
        }
    }

    @UseGuards(JwtGuard)
     handleDisconnect(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);

        const gameIndex = this.RandomGames.findIndex((game) => game.game.id1 == socket.id || game.game.id2 == socket.id);
        const privateIndex = this.privateGame.findIndex((game) => game.game.id1 == socket.id || game.game.id2 == socket.id);
        
        if (gameIndex >= 0){
            const game: GameModel = this.RandomGames[gameIndex].game;
            if (socket.id == game.socket1.id){
                game.socket2?.emit('gameEnded', {state: 'win'});
            }
            else if (socket.id == game.socket2.id){
                game.socket1?.emit('gameEnded', {state: 'win'});
            }
            game.destroy();
            this.RandomGames.splice(gameIndex, 1);
        }
        else if(privateIndex >= 0){
            const game: GameModel = this.privateGame[privateIndex].game;
            if (socket.id == game.socket1.id){
                game.socket2?.emit('gameEnded', {state: 'win'});
            }
            else if (socket.id == game.socket2.id){
                game.socket1?.emit('gameEnded', {state: 'win'});
            }
            game.destroy();
            this.privateGame.splice(privateIndex, 1);
        }
        this.ConnectedUsers.delete(decoded['login']);
        console.log("GameGateway handleDisconnect", socket.id, decoded['login']);
    }
}