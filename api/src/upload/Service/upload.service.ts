import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class UploadService {
  private gridFs: any;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.gridFs = new mongoose.mongo.GridFSBucket(this.connection.db);
  }

  async uploadFile(stream: NodeJS.ReadableStream, filename: string): Promise<string> {
    const uploadStream = this.gridFs.openUploadStream(filename);
    stream.pipe(uploadStream);
    return new Promise<string>((resolve, reject) => {
      uploadStream.once('finish', () => resolve(uploadStream.id.toString()));
      uploadStream.once('error', (err) => reject(err));
    });
  }

  async getFileStream(fileId: string): Promise<NodeJS.ReadableStream> {
    const downloadStream = this.gridFs.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    if (!downloadStream) {
      throw new NotFoundException('File not found');
    }
    return downloadStream;
  }
}