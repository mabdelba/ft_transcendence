import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtDecode from 'jwt-decode';

@WebSocketGateway()
export class StateGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer() server: Server;
  users = new Map();
  @UseGuards(JwtGuard)
  handleConnection(client: Socket) {
    this.users.set(client.id, null);
  }
  
  async handleDisconnect(client: any) {
    if (!this.users.has(client.id)) {
    await this.prisma.user.update({
      where: {
        login: this.users.get(client.id),
      },
      data: {
        state: 0,
      },
    });
    this.users.delete(client.id);
    }
    console.log("offline");
  }

  @SubscribeMessage('online')
  async setOnline(client: Socket, message: {token: string}) {
    const jwtToken = message.token;
    const decoded = jwtDecode(jwtToken);
    console.log("online----", decoded['login']);
    this.users.set(client.id, decoded['login']);
    await this.prisma.user.update({
      where: {
        login: decoded['login'],
      },
      data: {
        state: 1,
      }
    });
  }
}
