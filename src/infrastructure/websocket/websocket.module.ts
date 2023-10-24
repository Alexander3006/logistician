import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { ConnectionsState } from './services/connection-state.service';
import { MainWebsocketGateway } from './gateways/main.gateway';
import { RedisModule } from 'nestjs-redis';
import { WebsocketNotificationService } from './services/notification.service';

@Module({
  imports: [ConfigModule, AuthModule, RedisModule],
  providers: [
    ConnectionsState,
    MainWebsocketGateway,
    WebsocketNotificationService,
  ],
  exports: [WebsocketNotificationService],
})
export class WebsocketModule {}
