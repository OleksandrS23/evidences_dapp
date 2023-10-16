import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { MongooseModule} from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EthereumService } from './ethereum/ethereum.service';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    UploadModule,
    AuthModule,
  ],
  exports: [MongooseModule],
  providers: [EthereumService],
})
export class AppModule {}
