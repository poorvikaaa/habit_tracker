import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["boolean","quantity"], default: "boolean" },
  goal: { type: Number, default: 1 },
  frequency: { type: Object, default: () => ({ mode: "daily" }) },
  color: String,
  icon: String,
  archived: { type: Boolean, default: false },
  reminder: { type: Object, default: null },
  createdAt: { type: Date, default: Date.now }
});

habitSchema.index({ userId: 1 });

export default mongoose.model("Habit", habitSchema);
