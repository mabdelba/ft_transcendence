import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtDecode from 'jwt-decode';

@WebSocketGateway()
export class StateGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer() server: Server;
  @UseGuards(JwtGuard)
  async handleConnection(client: Socket) {
    const jwtToken = client.handshake.auth.token;
    const decoded = jwtDecode(jwtToken);
    console.log('connected', decoded['login']);
    await this.prisma.user.update({
      where: {
        login: decoded['login'],
      },
      data: {
        state: 1,
      },
    });
  }

  @UseGuards(JwtGuard)
  async handleDisconnect(client: any) {
    const jwtToken = client.handshake.auth.token;
    const decoded = jwtDecode(jwtToken);
    console.log('disconnected');
    await this.prisma.user.update({
      where: {
        login: decoded['login'],
      },
      data: {
        state: 0,
      },
    });
  }
}
