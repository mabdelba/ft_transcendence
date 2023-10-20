import { WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway(3001, { namespace: 'game' })
export class GameGateway {

    handleConnection(socket: Socket) {
        console.log("GameGateway handleConnection", socket.id);
    }

    handleDisconnect(socket: Socket) {
        console.log("GameGateway handleDisconnect", socket.id);
    }
}