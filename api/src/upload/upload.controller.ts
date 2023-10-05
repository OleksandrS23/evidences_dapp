import {
  UseGuards,
  Controller,
  Post,
  Get,
  Param,
  Res,
  Request,
  UploadedFiles,
  UseInterceptors,
  Query,
  Body,
  HttpException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './Service/upload.service';
import * as stream from 'stream';
import { AuthGuard } from '@nestjs/passport';
import { EthereumService } from 'src/ethereum/ethereum.service';
import { SHA256, enc } from 'crypto-js';
import * as crypto from 'crypto';

@Controller('files')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly ethereumService: EthereumService,
  ) {}

  @UseGuards(AuthGuard('eth-jwt'))
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('evidenceCode') evidenceCode: string,
    @Query('address') address: string,
  ) {
    console.log(evidenceCode, address);

    if (!files || files.length === 0) {
      return { message: 'No files uploaded' };
    }

    const uploadedFileIds: any = [];
    for (const file of files) {
      console.log(file);
      const readableStream = stream.Readable.from(file.buffer);

      const buffer = file.buffer;
      
      const fileHash = crypto.createHash('sha256').update(buffer.toString()).digest('hex');
      await this.uploadService
        .uploadFile(readableStream, file.originalname)
        .then((result) => {
          // console.log('Sending to Smart Contract');
          // this.ethereumService.sendContractTransaction(
          //   address,
          //   'addFile',
          //   ...[evidenceCode, result, file.originalname, fileHash],
          // );
          uploadedFileIds.push({ id: result, filename: file.originalname, filehash: fileHash});
          return result;
        });
    }

    return { uploadedFileIds };
  }

  @UseGuards(AuthGuard('eth-jwt'))
  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileStream = await this.uploadService.getFileStream(fileId);
    fileStream.pipe(res);
  }

  @Post(':fileId')
  async verifyFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
    @Request() req,
    @Body() body: any,
  ) {
    try {
      const fileStream = await this.uploadService.getFileStream(fileId);
      const fileHash = await calculateSHA256Hash(fileStream);
      console.log(fileHash)
      if (fileHash === body.fileHash) {
        return res.status(200).json({ isVerified: true });
      }

      return res.status(200).json({ isVerified: false });
    } catch (ex) {
      console.error('Error:', ex);
      return res.status(200).json({ isVerified: false });
    }
  }
}

async function calculateSHA256Hash(stream): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    let data = '';
    stream.on('data', (chunk) => {
      data += chunk;
    });

    stream.on('end', () => {
      const fileHash = hash.update(data).digest('hex');
      resolve(fileHash);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}