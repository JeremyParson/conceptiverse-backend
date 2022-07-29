import mongoose, { Model, Schema, Types } from "mongoose";

interface ITestCase {
    test: Types.ObjectId,
    className: string,
    methodName:string,
    parameters: [any],
    expectedOutput: any,
    creator: Types.ObjectId
}

type ITestCaseModel = Model<ITestCase>

const TestCaseSchema = new Schema({
    test: { type: Schema.Types.ObjectId, ref: 'test' },
    className: String,
    methodName: String,
    parameters: [Schema.Types.Mixed],
    expectedOutput: Schema.Types.Mixed,
    creator: Schema.Types.ObjectId
});

export default mongoose.model<ITestCase, ITestCaseModel>('test case', TestCaseSchema);
