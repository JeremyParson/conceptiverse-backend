import { Router } from "express";
import { Chapter, Lesson, Test } from "../models";
import { Error, Types } from "mongoose";

const router = Router();

// Index Chapters
router.get("/", async (req, res) => {
  try {
    const chapters = await Chapter.find();
    res.json(chapters).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
  }
});

// Detail Chapter
router.get("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    await chapter.populate('test')
    res.json(chapter).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
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

// Create Chapter
router.post("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!req.currentUser._id.equals(lesson.creator)) {
      return res
        .status(400)
        .json({ message: "You cannot create this chapter" });
    }

    const chapterCount = await Chapter.countDocuments({
      lesson: lesson._id,
    });

    const chapter = new Chapter({
      ...req.body,
      name: req.body.name ? req.body.name : `Chapter ${chapterCount + 1}`,
      index: chapterCount,
      lesson: lesson._id,
      creator: req.currentUser._id,
    });

    lesson.chapters.push(chapter._id);
    await lesson.save()

    await chapter.save();
    res.json(chapter).status(200);
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
  const chapter = await Chapter.findById(req.params.id)
  if (!chapter)
      return res.status(400).json({ message: "chapter does not exist" });
  
  if (!req.currentUser._id.equals(chapter.creator)) {
    res
      .status(400)
      .json({ message: "You are not authorized to access this resource." });
    return;
  }
  next();
});

// Update Chapter
router.patch("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)

    console.log(req.currentUser._id, chapter.creator);
    
    for (let key in req.body) chapter.set(key, req.body[key]);
    await chapter.save();
    res.json(chapter).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Delete a chapter
router.delete("/:id", async (req, res) => {
  try {
    const deleteChapter = await Chapter.findById(req.params.id);

    const lessonId = deleteChapter.lesson;

    await deleteChapter.deleteTests();
    await deleteChapter.delete();

    const chapters = await Chapter.find({ lesson: lessonId });

    for (let index in chapters) {
      let chapter = chapters[index];
      chapter.index = Number(index);
      await chapter.save();
    }

    res.json({ message: "Chapter deleted" }).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

export default router;
