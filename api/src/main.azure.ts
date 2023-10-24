import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

// const cors = require('cors');

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  // app.use(cors({
  //   origin: 'https://evidencesdapp.azurewebsites.net/', // Replace with the URL of your frontend app
  //   methods: ['GET', 'POST'], // Add other methods as needed
  //   credentials: true, // Allow cookies to be sent
  // }));

  await app.init();
  return app;
}
