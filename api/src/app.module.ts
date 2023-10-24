import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { MongooseModule} from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EthereumService } from './ethereum/ethereum.service';
import 'dotenv/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    UploadModule,
    AuthModule,
    AppModule
  ],
  controllers: [AppController],
  exports: [MongooseModule, AppModule],
  providers: [EthereumService, AppService],
})
export class AppModule {}
