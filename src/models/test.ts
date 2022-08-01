import mongoose, { Model, Schema, Types } from "mongoose";
import {ITestCase} from "./testCase"

interface ITest {
    chapter: Types.ObjectId,
    testType: string,
    className: string,
    methodName:string,

    javascript: string,
    cpp: string,
    rust: string,
    python: string,
    java: string,
    
    testCases: [Types.ObjectId],
    creator: Types.ObjectId,
}

export interface PopulatedITest {
    testCases: [ITestCase] | null
}

type ITestModel = Model<ITest>

const TestSchema = new Schema({
    chapter: {type: Schema.Types.ObjectId, ref:'chapter', required: true},
    testType: {
        type: String,
        enum: ['function', 'class'],
        default: 'function'
    },
    className: String,
    methodName: String,

    javascript: String,
    cpp: String,
    rust: String,
    python: String,
    java: String,

    testCases: [{ type: Schema.Types.ObjectId, ref: 'test case' }],
    creator: Schema.Types.ObjectId
});

export default mongoose.model<ITest, ITestModel>('test', TestSchema);
