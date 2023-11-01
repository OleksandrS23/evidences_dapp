import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChangeStreamService } from './changeStream.service';
import { ChangeSchema, ChangeData } from './Schema/changes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChangeData.name, schema: ChangeSchema }]),
  ],
  controllers: [],
  providers: [ChangeStreamService],
})
export class ChangesModule {}
