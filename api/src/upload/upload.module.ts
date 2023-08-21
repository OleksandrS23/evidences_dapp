import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadController } from './upload.controller';
import { UploadService  } from './Service/upload.service';
//import { File, FileSchema } from './Schema/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
