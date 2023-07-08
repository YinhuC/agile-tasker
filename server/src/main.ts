import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://agile-tasker.onrender.com'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: process.env.REACT_APP_SECRET,
      resave: false,
      saveUninitialized: false,
      name: 'SESSION_ID',
      cookie: {
        maxAge: 86400000,
        secure: process.env.REACT_APP_NODE_ENV === 'production',
        sameSite:
          process.env.REACT_APP_NODE_ENV === 'production' ? 'none' : 'lax',
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await app.listen(process.env.PORT || 3300, () => {
      console.log(`Running on Port ${process.env.PORT || 3300}`);
      console.log(`API URL: ${process.env.REACT_APP_API_URL}`);
    });
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
