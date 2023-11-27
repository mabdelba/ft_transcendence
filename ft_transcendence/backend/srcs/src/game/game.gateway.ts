import { continueStatement } from "@babel/types";
import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import jwtDecode from "jwt-decode";
import { Socket } from "socket.io";
import { JwtGuard } from "src/auth/guards";
import GameModel from "./game.service";
import { disconnect } from "process";
import { subscribe } from "diagnostics_channel";
import { PrismaService } from "src/prisma/prisma.service";
import { getAvatarFromLogin2 } from "src/utils/get-avatar-from-login";
@WebSocketGateway(3001, { cors: '*' }) 
export class GameGateway {
    ConnectedUsers: Map<string, string[]> = new Map<string, string[]>();
    RandomGames: { game: GameModel, id1: string, id2: string, map: string }[] = [];
    privateGame: { game: GameModel, id1: string, id2: string}[] = [];
    constructor(private prisma: PrismaService) {}
 
    @UseGuards(JwtGuard)
    async handleConnection(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        if (this.ConnectedUsers.has(login)) {
            this.ConnectedUsers.get(login)?.push(socket.id);
            socket.emit('already connected');
            // console.log('geteway',socket.id)
            console.log('already connected', login, socket.id);
            // socket.disconnect();
        }
        else{
            this.ConnectedUsers.set(login, [socket.id]);
            console.log('connected', login, socket.id);
            await this.prisma.user.update({
                where: {
                  login: login,
                },
                data: {
                  state: 2,
                },
              });
        }
    }

    @SubscribeMessage('NewGame')
    async handleNewGame(@ConnectedSocket() socket: Socket, @MessageBody() data: { map: string, type: string, opponent?: string}) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        const index = this.RandomGames.findIndex((game) => game.map == data.map && (game.id1 !== login && game.id2 !== login));
        const check = this.RandomGames.findIndex((game) => game.id1 == login || game.id2 == login);
        const privateIndex = this.privateGame.findIndex((game) => ((game.id1 !== login && game.id2 !== login)));
        const privateCheck = this.privateGame.findIndex((game) => ((game.id1 == login || game.id2 == login)));
        if(data.type == 'private'){
            if (privateCheck >= 0){
                console.log("index "+ privateCheck +" "+ login +" joined private game");
                const game = this.privateGame[privateCheck];
                game.game.setSocket2(socket);
                game.game.setID2(socket.id);
                game.id2 = login;
                const avatarUrl1 = await getAvatarFromLogin2(game.id1);
                const avatarUrl2 = await getAvatarFromLogin2(game.id2);
                game.game.socket1.emit('ready', {login: game.id2, avatarUrl: avatarUrl2});
                game.game.socket2.emit('ready', {login: game.id1, avatarUrl: avatarUrl1});
            }else if(privateIndex < 0) 
            {
                let game: GameModel = new GameModel(socket, this.prisma);
                console.log(login ,"private game create for "+ data.opponent);
                this.privateGame.push({game: game, id1: login, id2: data.opponent});
            } 
        }
        else {
            if (index >= 0){
                console.log("index "+ index +" "+ login +" joined game");
                const game = this.RandomGames[index];
                game.game.setSocket2(socket);
                game.game.setID2(socket.id);
                game.id2 = login;
                const avatarUrl1 = await getAvatarFromLogin2(game.id1);
                const avatarUrl2 = await getAvatarFromLogin2(game.id2);
                game.game.socket1.emit('ready', {login: game.id2, avatarUrl: avatarUrl2});
                game.game.socket2.emit('ready', {login: game.id1, avatarUrl: avatarUrl1});
            }else if(check < 0)
            {
                let game: GameModel = new GameModel(socket, this.prisma);
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
            game.runGame();
        }
        else if(privateIndex >= 0 && this.privateGame[privateIndex].game.socket1.connected && this.privateGame[privateIndex].game.socket2.connected){
            const game: GameModel = this.privateGame[privateIndex].game;
            game.runGame();
        }
    }

    @SubscribeMessage('MovePlayer')
    handleMovePlayer(@ConnectedSocket() socket: Socket, @MessageBody() data: { x: number}) {
        const index = this.RandomGames.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));
        const privateIndex = this.privateGame.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));

        if (index >= 0){
            const game: GameModel = this.RandomGames[index].game;
            game.movePlayer(socket.id, data.x);
        }
        else if(privateIndex >= 0){
            const game: GameModel = this.privateGame[privateIndex].game;
            game.movePlayer(socket.id, data.x);
        }
    }

    @SubscribeMessage('endGame')
    async handleEndGame(@ConnectedSocket() socket: Socket) {
        const index = this.RandomGames.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));
        const privateIndex = this.privateGame.findIndex((game) => (game.game.id1 == socket.id || game.game.id2 == socket.id));
        console.log("end game");
        if (index >= 0){
            const game: GameModel = this.RandomGames[index].game;
            const id1 = this.RandomGames[index].id1;
            const id2 = this.RandomGames[index].id2;
            if (socket.id == game.socket2.id){
                game.socket1.emit('gameEnded', {state: 'win'});
                game.socket2.emit('gameEnded', {state: 'lose'});
                this.RandomGames.splice(index, 1);
                await game.endGame(id1, id2, game.player1Score, game.player2Score);
            }
            else if(socket.id == game.socket1.id){
                game.socket1.emit('gameEnded', {state: 'lose'});
                game.socket2.emit('gameEnded', {state: 'win'});
                this.RandomGames.splice(index, 1);
                await game.endGame(id2, id1, game.player2Score, game.player1Score);
            }
            this.ConnectedUsers.delete(id1);
            this.ConnectedUsers.delete(id2);
            game.destroy();
        }
        else if(privateIndex >= 0){
            const game: GameModel = this.privateGame[privateIndex].game;
            const id1 = this.privateGame[privateIndex].id1;
            const id2 = this.privateGame[privateIndex].id2;
            if (socket.id == game.socket2.id){
                game.socket1.emit('gameEnded', {state: 'win'});
                game.socket2.emit('gameEnded', {state: 'lose'});
                this.privateGame.splice(privateIndex, 1);
                await game.endGame(id1, id2, game.player1Score, game.player2Score);
            }
            else if(socket.id == game.socket1.id){
                game.socket1.emit('gameEnded', {state: 'lose'});
                game.socket2.emit('gameEnded', {state: 'win'});
                this.privateGame.splice(privateIndex, 1);
                await game.endGame(id2, id1, game.player2Score, game.player1Score);
            }
            this.ConnectedUsers.delete(id1);
            this.ConnectedUsers.delete(id2);
            game.destroy();
        }
    }
    @SubscribeMessage('CancelGame')
    handleCancelGame(@ConnectedSocket() socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];
        const index = this.RandomGames.findIndex((game) => game.id1 == login || game.id2 == login);
        const privateIndex = this.privateGame.findIndex((game) => game.id1 == login || game.id2 == login);
        console.log("cancel game", index, this.RandomGames.length);
        if(index >= 0){
            this.RandomGames[index].game.destroy();
            this.RandomGames.splice(index, 1);
        }
        else if(privateIndex >= 0){
            this.privateGame[privateIndex].game.destroy();
            this.privateGame.splice(privateIndex, 1);
        }
        console.log("cancel game", index, this.RandomGames.length);
    }

    @UseGuards(JwtGuard)
     async handleDisconnect(socket: Socket) {
        const jwtToken = socket.handshake.auth.token;
        const decoded = jwtDecode(jwtToken);
        const login = decoded['login'];

        const gameIndex = this.RandomGames.findIndex((game) => game.game.id1 == socket.id || game.game.id2 == socket.id);
        const privateIndex = this.privateGame.findIndex((game) => game.game.id1 == socket.id || game.game.id2 == socket.id);
        
        if (gameIndex >= 0){
            const game: GameModel = this.RandomGames[gameIndex].game;
            const id1 = this.RandomGames[gameIndex].id1;
            const id2 = this.RandomGames[gameIndex].id2;
            if (socket.id == game.socket1.id){
                game.socket2?.emit('gameEnded', {state: 'win'});
                await game.endGame(id2, id1, game.player2Score, game.player1Score);
            }
            else if (socket.id == game.socket2.id){
                game.socket1?.emit('gameEnded', {state: 'win'});
                await game.endGame(id1, id2, game.player1Score, game.player2Score);
            }
            game.destroy();
            this.RandomGames.splice(gameIndex, 1);
        }
        else if(privateIndex >= 0){
            const pGame: GameModel = this.privateGame[privateIndex].game;
            const id1 = this.privateGame[privateIndex].id1;
            const id2 = this.privateGame[privateIndex].id2;
            if (socket.id == pGame.socket1.id){
                pGame.socket2?.emit('gameEnded', {state: 'win'});
                await pGame.endGame(id2, id1, pGame.player2Score, pGame.player1Score);
            }
            else if (socket.id == pGame.socket2.id){
                pGame.socket1?.emit('gameEnded', {state: 'win'});
                await pGame.endGame(id1, id2, pGame.player1Score, pGame.player2Score);
            }
            pGame.destroy();
            this.privateGame.splice(privateIndex, 1);
        }
        const ids = this.ConnectedUsers.get(login);
        if(ids?.length > 1)
            ids.splice(ids.indexOf(socket.id), 1);
        else{
            this.ConnectedUsers.delete(login);
        
            await this.prisma.user.update({
                where: {
                  login: login,
                },
                data: {
                  state: 1,
                },
            });
            console.log("GameGateway handleDisconnect", socket.id, login, );
        }
    }
}