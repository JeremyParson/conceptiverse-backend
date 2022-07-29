import mongoose, { Model, Schema, Types } from "mongoose";

interface ILesson {
  name: string;
  description: string;
  rating: number;
  comments: [Types.ObjectId];
  creator: Types.ObjectId;
  chapters?: [ Types.ObjectId ];
}

interface ILessonMethods {
  deleteChapters(): Promise<void>;
}

type ILessonModel = Model<ILesson, {}, ILessonMethods>;

const LessonSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: Number,
    comments: [Schema.Types.ObjectId],
    creator: Schema.Types.ObjectId,
    chapters: [{ type: Schema.Types.ObjectId, ref: "chapter" }],
  },
  {
    methods: {
      async deleteChapters() {
        await mongoose.model("chapter").deleteMany({ lesson_id: this._id });
      },
    },
  }
);

export default mongoose.model<ILesson, ILessonModel, ILessonMethods>(
  "lesson",
  LessonSchema
);
