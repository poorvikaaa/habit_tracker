import Entry from "../models/Entry.js";
import Habit from "../models/Habit.js";
import { computeDayKey } from "../utils/dayKey.js";

/**
 * GET /api/entries?start=YYYY-MM-DD&end=YYYY-MM-DD&habitId=
 * Returns entries for user in range (optionally filtered by habitId)
 */
export async function getEntries(req, res) {
  const userId = req.user._id;
  const { start, end, habitId } = req.query;
  const q = { userId };
  if (start && end) q.dayKey = { $gte: start, $lte: end };
  if (habitId) q.habitId = habitId;
  const entries = await Entry.find(q).sort({ dayKey: 1 });
  res.json(entries);
}

/**
 * POST /api/entries
 * Body: { habitId, timestamp?, value?, skipped? }
 * Upserts one entry per habit/day
 */
export async function upsertEntry(req, res) {
  const userId = req.user._id;
  const { habitId, timestamp, value = 1, skipped = false } = req.body;
  if (!habitId) return res.status(400).json({ error: "habitId required" });

  // ensure habit belongs to user
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) return res.status(404).json({ error: "habit not found" });

  // compute dayKey using user timezone/dayStartHour (mockAuth provides these)
  const tz = req.user.timezone || "UTC";
  const dsh = typeof req.user.dayStartHour === "number" ? req.user.dayStartHour : 0;
  const ts = timestamp ? new Date(timestamp) : new Date();
  const dayKey = computeDayKey(ts, tz, dsh);

  // upsert (create or update) - for quantity you might want to aggregate; here we set the value
  const entry = await Entry.findOneAndUpdate(
    { userId, habitId, dayKey },
    { $set: { timestamp: ts, value, skipped } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(entry);
}

/**
 * DELETE /api/entries
 * Accepts body { habitId, dayKey } OR query param id
 */
export async function deleteEntry(req, res) {
  const userId = req.user._id;

  // allow deletion by id: DELETE /api/entries/:id  (but we use body for flexibility)
  const { id } = req.params;
  if (id) {
    const e = await Entry.findOneAndDelete({ _id: id, userId });
    return res.json({ deleted: !!e });
  }

  const { habitId, dayKey } = req.body;
  if (!habitId || !dayKey) return res.status(400).json({ error: "habitId and dayKey required" });
  const e = await Entry.findOneAndDelete({ userId, habitId, dayKey });
  res.json({ deleted: !!e });
}
