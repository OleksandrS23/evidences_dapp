import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log(process.env.WEB3_PROVIDER)
  console.log(process.env.NETWORK_ID)

  app.use(cors({
    origin: 'https://evidencesdapp.azurewebsites.net/', // Replace with the URL of your frontend app
    methods: ['GET', 'POST'], // Add other methods as needed
    credentials: true, // Allow cookies to be sent
  }));

  await app.listen(process.env.WEBSITES_PORT);
}
bootstrap();
