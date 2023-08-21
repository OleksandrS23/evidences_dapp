import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { MongooseModule} from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config';

@Module({
  imports: [UploadModule,
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    AuthModule,
  ],
  exports: [MongooseModule],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
