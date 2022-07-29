declare namespace Express {
    export interface Request {
        currentUser: User
    }
}

type User = {
    role: String,
    _id: import('mongoose').Types.ObjectId,
}

// type Lesson = {
//     _id: import('mongoose').Types.ObjectId,
//     creator: import('mongoose').Types.ObjectId,
//     deleteChapters: Function,
//     delete: Function,
//     save: Function,
//     set: Function,
// }