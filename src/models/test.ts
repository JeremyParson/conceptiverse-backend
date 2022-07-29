import mongoose, { Model, Schema, Types } from "mongoose";

interface ITestCase {
    chapter: Types.ObjectId,
    testType: string,
    testCases: [Types.ObjectId],
    creator: Types.ObjectId
}

type ITestCaseModel = Model<ITestCase>

const TestSchema = new Schema({
    chapter: {type: Schema.Types.ObjectId, ref:'chapter', required: true},
    testType: {
        type: String,
        enum: ['function', 'class'],
        default: 'function'
    },
    testCases: [{ type: Schema.Types.ObjectId, ref: 'test case' }],
    creator: Schema.Types.ObjectId
});

export default mongoose.model<ITestCase, ITestCaseModel>('test', TestSchema);
