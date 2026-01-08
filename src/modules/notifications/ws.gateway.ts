import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/notifications' })
export class WsGateway {
  private readonly logger = new Logger(WsGateway.name);

  @WebSocketServer()
  server!: Server;

  broadcast(event: string, payload: unknown) {
    this.logger.log(`WS broadcast: ${event}`);
    this.server.emit(event, payload);
  }
}
