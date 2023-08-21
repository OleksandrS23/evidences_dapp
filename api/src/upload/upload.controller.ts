import { UseGuards, Controller, Post, Get, Param, Res,Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './Service/upload.service';
import * as stream from 'stream';
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard('eth-jwt'))
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {

    if (!files || files.length === 0) {
      return { message: 'No files uploaded' };
    }

    const uploadedFileIds: string[] = [];
    for (const file of files){
      console.log(file.buffer)
      const readableStream = stream.Readable.from(file.buffer);
      // Handle each file, e.g., save to GridFS or perform other actions
      const fileId = await this.uploadService.uploadFile(readableStream, file.originalname);
      uploadedFileIds.push(fileId);
    }
    
    return { uploadedFileIds };
  }
  @UseGuards(AuthGuard('eth-jwt'))
  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string, @Res() res: Response, @Request() req) {
    const fileStream = await this.uploadService.getFileStream(fileId);
    fileStream.pipe(res);
  }
}
