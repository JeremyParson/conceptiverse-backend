import {Router, Request, Response} from "express"
import { User } from "../models";
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"

const router = Router()

router.post("/", async (req: Request, res: Response) => {
  let user = await User.findOne({ email: req.body.email })
  if (
    !user ||
    !(bcrypt.compareSync(req.body.password, user.passwordDigest))
  ) {
    res.status(404).json({
      message: `Could not find a user with the provided username and password`,
    });
  } else {
    const result = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user: user, token: result });
  }
});

router.get("/profile", async (req: Request, res: Response) => {
  res.json(req.currentUser)
});

export default router;
