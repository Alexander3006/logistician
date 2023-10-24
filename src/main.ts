import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { InitCustomWebSocketAdapter } from './infrastructure/websocket/adapters/ws.adapter';
import { AppExceptionFilter } from './common/exceptions';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { otel } from './otel';

async function bootstrap() {
  await otel.start()
  
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  InitCustomWebSocketAdapter(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFileSize: 1024 * 1024 * 1024,
      maxFiles: 10,
    }),
  );

  await app.listen(3000);
}
bootstrap();
