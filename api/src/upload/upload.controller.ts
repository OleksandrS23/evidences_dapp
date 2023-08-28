import { UseGuards, Controller, Post, Get, Param, Res,Request, UploadedFiles, UseInterceptors, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './Service/upload.service';
import * as stream from 'stream';
import { AuthGuard } from '@nestjs/passport';
import { EthereumService } from 'src/ethereum/ethereum.service';
import * as CryptoJS from 'crypto-js';


@Controller('files')
export class UploadController {
  constructor(private readonly uploadService: UploadService, private readonly ethereumService: EthereumService) {}

  @UseGuards(AuthGuard('eth-jwt'))
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Query('evidenceCode') evidenceCode: string, @Query('address') address: string) {

    console.log(evidenceCode, address)
    

    if (!files || files.length === 0) {
      return { message: 'No files uploaded' };
    }

    const uploadedFileIds: any = [];
    for (const file of files){
      console.log(file)
      const readableStream = stream.Readable.from(file.buffer);

      const buffer = file.buffer;
      const fileHash = CryptoJS.SHA256(buffer).toString(CryptoJS.enc.Hex);

      console.log(fileHash)
      await this.uploadService.uploadFile(readableStream, file.originalname).then(result=>
        {
          console.log("Sending to Smart Contract")
          this.ethereumService.sendContractTransaction(address, 'addFile', ...[evidenceCode, result, file.originalname, fileHash])
          uploadedFileIds.push({id: result, filename: file.originalname});
          return result;
        });
      
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