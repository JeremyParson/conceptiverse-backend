import mongoose, { Model, Schema, Types } from "mongoose";

interface IChapter {
  name: string;
  index: number;
  content: string;
  lesson: Types.ObjectId
  test: Types.ObjectId;
  creator: Types.ObjectId;
}

interface IChapterMethods {
  deleteTests(): Promise<void>;
}

type IChapterModel = Model<IChapter, {}, IChapterMethods>;

const ChapterSchema = new Schema(
  {
    name: String,
    index: { type: Number, required: true },
    content: { type: String, required: true },
    lesson: { type: Schema.Types.ObjectId, ref: "lesson", required: true},
    test: { type: Schema.Types.ObjectId, ref:'test' },
    creator: { type: Schema.Types.ObjectId, required: true },
  },
  {
    methods: {
      async deleteTests() {
        await mongoose.model("test").deleteMany({ chapter: this._id });
      },
    },
  }
);

export default mongoose.model<IChapter, IChapterModel, IChapterMethods>(
  "chapter",
  ChapterSchema
);
