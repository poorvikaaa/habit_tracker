import express from "express";
import { getEntries, upsertEntry, deleteEntry } from "../controllers/entriesController.js";

const router = express.Router();

router.get("/", getEntries);
router.post("/", upsertEntry);

// delete by body {habitId, dayKey} or by id param
router.delete("/:id?", deleteEntry);

export default router;
