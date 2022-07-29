import { User } from "../models";
const jwt= require("jsonwebtoken")
import {Request, Response} from "express"

async function defineCurrentUser(req: Request, res: Response, next: Function){
    try {
        const [ method, token ] = req.headers.authorization.split(' ')
        if(method == 'Bearer'){
            const result = jwt.verify(token, process.env.JWT_SECRET)
            const { id } = result
            let user = await User.findById(id)
            req.currentUser = user
            console.log("user defined")
        }
        next()
    } catch(err){
        console.log("user not defined")
        req.currentUser = null
        next()
    }
}

export default defineCurrentUser;
