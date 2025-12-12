import express from "express";
import { listHabits, createHabit, getHabit } from "../controllers/habitsController.js";

const router = express.Router();

router.get("/", listHabits);
router.post("/", createHabit);
router.get("/:id", getHabit);

export default router;
