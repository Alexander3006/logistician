import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

export const connectionSource = new DataSource({
  type: 'postgres',
  replication: {
    master: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    slaves: [
      {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    ],
  },
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity.{ts,js}'],
  // entities: [path.join(__dirname, '**', '*.entity{ts, js}')],
  migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/migrations',
  },
} as DataSourceOptions);
