import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { UserModule } from './domain/user/user.module';
import { RedisModule } from 'nestjs-redis';
import { WebsocketModule } from './infrastructure/websocket/websocket.module';
import { CarModule } from './domain/cars/car.module';
import { OrderModule } from './domain/orders/order.module';
import { CurrencyModule } from './domain/currency/currency.module';
import { FileModule } from './infrastructure/file/file.module';
import { BalanceHistoryModule } from './domain/balance-history/balance-history.module';
import { ConfigModule } from './config/config.module';
import { FeedbackModule } from './domain/feedback/feedback.module';
import { LocationModule } from './domain/location/location.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TelemetryModule } from './config/telemetry.module';

const database = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ({
        type: 'postgres',
        replication: {
          master: {
            host: configService.getOrThrow('DB_HOST'),
            port: configService.getOrThrow('DB_PORT'),
            username: configService.getOrThrow('DB_USER'),
            password: configService.getOrThrow('DB_PASSWORD'),
            database: configService.getOrThrow('DB_NAME'),
          },
          slaves: [
            {
              host: configService.getOrThrow('DB_HOST'),
              port: configService.getOrThrow('DB_PORT'),
              username: configService.getOrThrow('DB_USER'),
              password: configService.getOrThrow('DB_PASSWORD'),
              database: configService.getOrThrow('DB_NAME'),
            },
          ],
        },
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        autoLoadEntities: true,
        entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
        migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
        seeds: [path.join(__dirname, '/seeds/**/*{.ts,.js}')],
      } as TypeOrmModuleOptions),
  }),
];

const graphql = GraphQLModule.forRootAsync({
  driver: ApolloDriver,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
    context: ({ req, res }) => ({ req, res }),
    playground: configService.getOrThrow('MODE') === 'development',
    introspection: true,
    cors: configService.getOrThrow('MODE') === 'development',
    uploads: false,
  }),
});

const redis = [
  RedisModule.register([
    {
      name: 'storage',
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    {
      name: 'location-storage',
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    {
      name: 'sub',
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    {
      name: 'pub',
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  ]),
];

@Module({
  imports: [
    TelemetryModule,
    DevtoolsModule.register({
      http: true,
    }),
    ConfigModule,
    ...database,
    ...redis,
    graphql,

    WebsocketModule,
    FileModule,

    UserModule,
    CarModule,
    OrderModule,
    FeedbackModule,
    CurrencyModule,
    BalanceHistoryModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
