import {
  INestApplicationContext,
  Logger,
  WebSocketAdapter,
  createParamDecorator,
} from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { IncomingMessage, createServer } from 'http';
import WebSocket, { Server, ServerOptions } from 'ws';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { URL } from 'url';
import { JWTTokenService } from '../../auth/services/jwt-token.service';
import { ConnectionsState } from '../services/connection-state.service';
import { JWTPayload } from 'src/infrastructure/auth/interfaces/jwt-token.payload';
import {
  ExecutionContext,
  INestApplication,
  WsArgumentsHost,
} from '@nestjs/common/interfaces';

const AUTH_SOCKET_KEY = 'CLIENT_AUTH';

export const SocketJWTPayload = createParamDecorator(
  (_, ctx: ExecutionContext): JWTPayload => {
    const wsArgumentsHost: WsArgumentsHost = ctx.switchToWs();
    const socket = wsArgumentsHost.getClient();
    const client = socket[AUTH_SOCKET_KEY];
    return client;
  },
);

export const InitCustomWebSocketAdapter = (
  app: INestApplication,
): INestApplication => {
  const configService = app.get(ConfigService);
  const connectionsState = app.get(ConnectionsState);
  const jwtService = app.get(JWTTokenService);
  app.useWebSocketAdapter(
    new CustomWebSocketAdapter(
      app,
      configService,
      jwtService,
      connectionsState,
    ),
  );
  return app;
};

export class CustomWebSocketAdapter
  extends WsAdapter
  implements WebSocketAdapter
{
  private readonly _logger: Logger;
  constructor(
    app: INestApplicationContext,
    private readonly configService: ConfigService,
    private readonly jwtService: JWTTokenService,
    private readonly connectionState: ConnectionsState,
  ) {
    super(app);
    this._logger = new Logger(CustomWebSocketAdapter.name);
  }

  public create(): Server {
    const host = this.configService.get<string>('WS_HOST') || '0.0.0.0';
    const port = this.configService.get<number>('WS_PORT') || 3001;
    const server = createServer(/*{ ...ssl() }*/).listen(port, host, () => {
      this._logger.log(`The server ws://${host}:${port} has been started`);
    });
    const wss = new Server({
      server: server,
      clientTracking: false,
    } as ServerOptions);
    return wss;
  }

  public bindClientConnect(
    server: Server,
    callback: (socket: WebSocket) => void,
  ) {
    server.on('connection', async (socket: WebSocket, req: IncomingMessage) => {
      try {
        const params = new URL(req.url || '/', 'ws://0.0.0.0').searchParams;
        const token = params.get('token');
        if (!token) throw new WsException(`No authentication token`);
        const payload = await this.jwtService
          .verifyAccessToken(token)
          .catch(() => ({
            id: null,
          }));
        if (!params) throw new WsException(`Invalid access token`);
        this.connectionState.registerSocket(payload.id, socket);
        socket.once('close', () =>
          this.connectionState.removeSocket(payload.id, socket),
        );
        socket[AUTH_SOCKET_KEY] = payload;
        callback(socket);
      } catch (err) {
        socket.terminate();
        this.logger.error(err);
      }
    });
  }
}
