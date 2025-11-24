import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const redisClient = createClient({
    url: 'redis://localhost:6379'
  });

  await redisClient.connect();

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'sess:'
  });

  app.use(  
    session({
      store: redisStore,
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
