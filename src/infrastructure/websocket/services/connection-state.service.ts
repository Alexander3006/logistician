import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import WebSocket from 'ws';

export class ConnectionsStateError extends Error {}

@Injectable({ scope: Scope.DEFAULT })
export class ConnectionsState {
  private readonly logger: Logger;
  private readonly clients: Map<string, Set<WebSocket>>;
  private readonly subscriptions: Map<string, WeakSet<WebSocket>>;
  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(ConnectionsState.name);
    this.clients = new Map<string, Set<WebSocket>>();
    this.subscriptions = new Map<string, WeakSet<WebSocket>>();
    const disablePingPong =
      configService.get<boolean>('DISABLE_PING_PONG') ?? true;
    if (!disablePingPong) {
      this.startPingPong();
    }
  }

  async registerSocket(userId: string, socket: WebSocket): Promise<void> {
    try {
      if (!this.configService.get<boolean>('DISABLE_PING_PONG') ?? true) {
        socket.on('pong', () => {
          socket['isAlive'] = true;
        });
        socket['isAlive'] = true;
      }
      socket.once('close', () => this.removeSocket(userId, socket));
      const sockets = this.clients.get(userId) || new Set<WebSocket>();
      sockets.add(socket);
      this.clients.set(userId, sockets);
      return;
    } catch (err) {
      this.logger.error(err);
      throw new ConnectionsStateError('Socket registration error');
    }
  }

  async removeSocket(userId: string, socket: WebSocket) {
    try {
      const sockets = this.clients.get(userId);
      if (!sockets) return;
      socket.terminate();
      sockets.delete(socket);
      return;
    } catch (err) {
      this.logger.error(err);
      throw new ConnectionsStateError('Socket delete error');
    }
  }

  async subscribe(socket: WebSocket, event: string) {
    try {
      const subscriptions =
        this.subscriptions.get(event) || new WeakSet<WebSocket>();
      subscriptions.add(socket);
      this.subscriptions.set(event, subscriptions);
      return;
    } catch (err) {
      this.logger.error(err);
      throw new ConnectionsStateError(`Event subscription error`);
    }
  }

  async unsubscribe(socket: WebSocket, event: string) {
    try {
      const subscriptions = this.subscriptions.get(event);
      if (!subscriptions) return;
      subscriptions.delete(socket);
      return;
    } catch (err) {
      this.logger.error(err);
      throw new ConnectionsStateError(`Event unsubscribe error`);
    }
  }

  async getSubscribedSockets(
    event: string,
    userIds?: string[],
  ): Promise<WebSocket[]> {
    try {
      const subscriptions = this.subscriptions.get(event);
      if (!subscriptions) return [];
      const sockets = Array.isArray(userIds)
        ? userIds
            .map((userId: string) => {
              const sockets = this.clients.get(userId);
              if (!sockets) return [];
              return [...sockets.values()];
            })
            .flat()
        : [...this.clients.values()]
            .map((sockets) => [...sockets.values()])
            .flat();
      const subscribed = sockets.filter((socket) => subscriptions.has(socket));
      return subscribed;
    } catch (err) {
      this.logger.error(err);
      throw new ConnectionsStateError(`Error getting signed tokens`);
    }
  }

  async sendMessage(event: string, payload: any, userIds?: string[]) {
    const message = JSON.stringify({
      event: event,
      payload: payload,
    });
    const sockets = await this.getSubscribedSockets(event, userIds);
    sockets.forEach((socket) => {
      socket.send(message, (err) => {
        if (err) this.logger.error(err);
      });
    });
    return;
  }

  private startPingPong() {
    const interval = 5000; //30000; //30 sec
    const ping = () => {
      for (const [userId, sockets] of this.clients.entries()) {
        sockets.forEach((socket) => {
          if (socket['isAlive'] === false) {
            this.removeSocket(userId, socket);
          }
          socket['isAlive'] = false;
          socket.ping();
        });
      }
    };
    const timer = setInterval(ping.bind(this), interval);
    return () => clearInterval(timer);
  }
}
