import { Router } from "express";
import { Chapter, Test } from "../models";
import { Error, Types } from "mongoose";

const router = Router();

// Index all tests
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
  }
});

// Detail test
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    await test.populate('testCases')
    if (!test) {
      return res.status(400).json({ message: "test does not exist" });
    }
    res
      .status(200)
      .json(test);
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

// Create test
router.post("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!req.currentUser._id.equals(chapter.creator)) {
      return res
        .status(400)
        .json({ message: "You cannot create this test" });
    }
    const test = new Test({
      ...req.body,
      creator: req.currentUser._id,
      chapter: req.params.id
    });
    chapter.test = test._id;
    await test.save();
    await chapter.save();
    res.json(test).status(200);
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
  const test = await Test.findById(req.params.id)
  if (!test)
      return res.status(400).json({ message: "Test does not exist" });
    
  if (!req.currentUser._id.equals(test.creator)) {
    res
      .status(400)
      .json({ message: "You are not authorized to access this resource." });
    return;
  }
  next();
});

// Update test
router.patch("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    for (let key in req.body) test.set(key, req.body[key]);
    await test.save();
    res.json(test).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Delete a test
router.delete("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    await test.delete();
    res.json({message: "test deleted"}).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

export default router;