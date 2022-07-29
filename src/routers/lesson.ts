import { Router } from "express";
import { Lesson, Chapter } from "../models";
import { Error, Types } from "mongoose";

const router = Router();

// Index all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
  }
});

// Detail Lesson
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    await lesson.populate('chapters')
    if (!lesson) {
      return res.status(400).json({ message: "Lesson does not exist" });
    }
    // const chapters = await Chapter.find({ lesson: req.params.id });
    const { name, _id, description, creator, comments, chapters } = lesson;
    res
      .status(200)
      .json({ name, _id, description, creator, comments, chapters });
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Authentication
router.use((req, res, next) => {
  if (!req.currentUser) {
    res
      .status(400)
      .json({ message: "You must be logged to access this resource." });
    return;
  }
  next();
});

// Create Lesson
router.post("/", async (req, res) => {
  try {
    const lesson = new Lesson({
      ...req.body,
      creator: req.currentUser._id,
    });
    await lesson.save();
    res.json(lesson).status(200);
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      res.json({ message: "Required fields were not filled" }).status(400);
      return;
    }
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Authorization
router.use("/:id", async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id)
  if (!lesson)
      return res.status(400).json({ message: "Lesson does not exist" });
    
  if (!req.currentUser._id.equals(lesson.creator)) {
    res
      .status(400)
      .json({ message: "You are not authorized to access this resource." });
    return;
  }
  next();
});

// Update Lesson
router.patch("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findOne({id: req.params.id});
    for (let key in req.body) lesson.set(key, req.body[key]);
    await lesson.save();
    res.json(lesson).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Delete a lesson
router.delete("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    await lesson.deleteChapters()
    await lesson.delete();
    res.json({message: "Lesson deleted"}).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

export default router;
