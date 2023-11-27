import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ConnectionsState } from '../services/connection-state.service';
import { Logger } from '@nestjs/common';
import { SocketJWTPayload } from '../adapters/ws.adapter';
import WebSocket from 'ws';
import { User } from 'src/domain/user/entities/user.entity';

@WebSocketGateway({ path: 'ws' })
export class MainWebsocketGateway {
  private readonly logger: Logger = new Logger(MainWebsocketGateway.name);
  constructor(private readonly connectionsState: ConnectionsState) {}

  @SubscribeMessage('subscribe')
  async handleSubscribeMessage(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: string,
    @SocketJWTPayload() _: User | { id: string },
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
