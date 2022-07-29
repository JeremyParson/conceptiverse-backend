import { Router } from "express";
import { Solution, Chapter } from "../models";
import { Error } from "mongoose";

const router = Router();

// Index all solutions
router.get("/", async (req, res) => {
  try {
    const solutions = await Solution.find();
    res.json(solutions).status(200);
  } catch (err) {
    res.json({ message: "Server ran into an error" }).status(500);
  }
});

// Detail solution
router.get("/:id", async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(400).json({ message: "solution does not exist" });
    }
    const { _id, code, creator, test } = solution;
    res
      .status(200)
      .json({ _id, creator, code, test });
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Authentication
router.use((req, res, next) => {
  if (!req.currentUser) {
    res
      .status(400)
      .json({ message: "You must be logged in to access this resource." });
    return;
  }
  next();
});

// Create solution
router.post("/:id", async (req, res) => {
  try {
    const solution = new Solution({
      ...req.body,
      creator: req.currentUser._id,
      test: req.params.id
    });
    await solution.save();
    res.json(solution).status(200);
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
  const solution = await Solution.findById(req.params.id)
  if (!solution)
      return res.status(400).json({ message: "Solution does not exist" });
    
  if (!req.currentUser._id.equals(solution.creator)) {
    res
      .status(400)
      .json({ message: "You are not authorized to access this resource." });
    return;
  }
  next();
});

// Update solution
router.patch("/:id", async (req, res) => {
  try {
    const solution = await Solution.findOne({id: req.params.id});
    for (let key in req.body) solution.set(key, req.body[key]);
    await solution.save();
    res.json(solution).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

// Delete a solution
router.delete("/:id", async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    await solution.delete();
    res.json({message: "solution deleted"}).status(200);
  } catch (err) {
    res.status(500).json({ message: "Server ran into an error" });
  }
});

export default router;
