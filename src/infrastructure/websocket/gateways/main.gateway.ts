import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ConnectionsState } from '../services/connection-state.service';
import { Logger } from '@nestjs/common';
import { SocketJWTPayload } from '../adapters/ws.adapter';
import { JWTPayload } from 'src/infrastructure/auth/interfaces/jwt-token.payload';
import WebSocket from 'ws';

@WebSocketGateway({ path: 'ws' })
export class MainWebsocketGateway {
  private readonly logger: Logger = new Logger(MainWebsocketGateway.name);
  constructor(private readonly connectionsState: ConnectionsState) {}

  @SubscribeMessage('subscribe')
  async handleSubscribeMessage(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: string,
    @SocketJWTPayload() jwtPaylod: JWTPayload,
  ) {
    try {
      await this.connectionsState.subscribe(socket, data);
      return;
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribeMessage(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: string,
  ) {
    try {
      await this.connectionsState.unsubscribe(socket, data);
      return;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
