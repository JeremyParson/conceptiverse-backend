import { Router } from "express";
import { Test, TestCase } from "../models";
import { Error, Types } from "mongoose";

const router = Router();

// Index all tests
router.get("/", async (req, res) => {
  try {
    const testCases = await TestCase.find();
    res.json(testCases).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
  }
});

// Detail test
router.get("/:id", async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase) {
      return res.status(400).json({ message: "testCase does not exist" });
    }
    res
      .status(200)
      .json(testCase);
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

// Create testCase
router.post("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!req.currentUser._id.equals(test.creator)) {
      return res
        .status(400)
        .json({ message: "You cannot create this testCase" });
    }
    const testCase = new TestCase({
      ...req.body,
      creator: req.currentUser._id,
      test: test._id
    });
    if (req.body.parameters) testCase.parameters = JSON.parse(req.body.parameters)
    test.testCases.push(testCase._id);
    await testCase.save();
    await test.save();
    res.json(testCase).status(200);
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
  const testCase = await TestCase.findById(req.params.id)
  if (!testCase)
      return res.status(400).json({ message: "testCase does not exist" });
    
  if (!req.currentUser._id.equals(testCase.creator)) {
    res
      .status(400)
      .json({ message: "You are not authorized to access this resource." });
    return;
  }
  next();
});

// Update testCase
router.patch("/:id", async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    for (let key in req.body) testCase.set(key, req.body[key]);
    await testCase.save();
    res.json(testCase).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Delete a testCase
router.delete("/:id", async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    await testCase.delete();
    res.json({message: "test deleted"}).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

export default router;