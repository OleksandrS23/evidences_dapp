import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection} from 'mongoose';

@Injectable()
export class ChangeStreamService {

    private gridFs: any;
    private collection: any;
    private logs : any;
  constructor(@InjectConnection() private readonly connection: Connection) {
    this.collection = this.connection.db.collection('fs.chunks')
    console.log("WHERE")
    this.initChangeStream();
  }

  private async initChangeStream() {
    
    const changeStream = this.collection.watch();

    changeStream.on('change', (change) => {
      // Processar a alteração aqui
      console.log('Change detected:', change);

      this.logs = this.logs + change;
    });
  }

  public returnLogs(){
    return this.logs;
  }
}
