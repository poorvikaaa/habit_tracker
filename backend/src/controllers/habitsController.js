import Habit from "../models/Habit.js";

export async function listHabits(req, res) {
  const userId = req.user._id;
  const habits = await Habit.find({ userId, archived: false }).sort({ createdAt: -1 });
  res.json(habits);
}

export async function createHabit(req, res) {
  const userId = req.user._id;
  const { title, type = "boolean", goal = 1, frequency = { mode: "daily" }, color, icon } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const doc = new Habit({ userId, title, type, goal, frequency, color, icon });
  await doc.save();
  res.status(201).json(doc);
}

export async function getHabit(req, res) {
  const userId = req.user._id;
  const habit = await Habit.findOne({ _id: req.params.id, userId });
  if (!habit) return res.status(404).json({ error: "not found" });
  res.json(habit);
}
