import * as mongoose from 'mongoose';

export const ChangeSchema = new mongoose.Schema({
  _id: {
    _data: String,
  },
  operationType: String,
  clusterTime: {
    t: Number,
    i: Number,
  },
  wallTime: Date,
  fullDocument: {
    _id: mongoose.Schema.Types.ObjectId,
    files_id: mongoose.Schema.Types.ObjectId,
    n: Number,
    data: mongoose.Schema.Types.Buffer,
  },
  ns: {
    db: String,
    coll: String,
  },
  documentKey: {
    _id: mongoose.Schema.Types.ObjectId,
  },
});

export class ChangeData extends mongoose.Document {
  _id: {
    _data: string;
  };
  operationType: string;
  clusterTime: {
    t: number;
    i: number;
  };
  wallTime: Date;
  fullDocument: {
    _id: mongoose.Types.ObjectId;
    files_id: mongoose.Types.ObjectId;
    n: number;
    data: Buffer;
  };
  ns: {
    db: string;
    coll: string;
  };
  documentKey: {
    _id: mongoose.Types.ObjectId;
  };
}
