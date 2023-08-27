import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: 'http://localhost:3000', // Replace with the URL of your frontend app
    methods: ['GET', 'POST'], // Add other methods as needed
    credentials: true, // Allow cookies to be sent
  }));

  await app.listen(3001);
}
bootstrap();
