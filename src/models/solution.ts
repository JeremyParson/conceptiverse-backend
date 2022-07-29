import mongoose, { Model, Schema, Types } from "mongoose";

interface ISolution {
    code: String,
    test: Types.ObjectId,
    creator: Types.ObjectId,
}


type ISolutionModel = Model<ISolution>;

const SolutionSchema = new Schema(
  {
    code: String,
    test: Schema.Types.ObjectId,
    creator: Schema.Types.ObjectId,
  },
);

export default mongoose.model<ISolution, ISolutionModel>('solution', SolutionSchema);
