import { Injectable } from '@nestjs/common';
import { InjectConnection , InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ChangeData } from './Schema/changes.schema';

@Injectable()
export class ChangeStreamService {

    private collection: any;

  constructor(@InjectModel(ChangeData.name)
  private model: Model<ChangeData>, @InjectConnection() private readonly connection: Connection) {
    this.collection = this.connection.db.collection('fs.chunks')
    this.initChangeStream();
  }

  private async initChangeStream() {
    
    const changeStream = this.collection.watch();

    changeStream.on('change', (change) => {
      const createdData = new this.model(change);
      createdData.save();
    });
  }
}
