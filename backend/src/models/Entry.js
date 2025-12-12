import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Habit" },
  timestamp: { type: Date, default: Date.now },
  dayKey: { type: String, required: true }, // YYYY-MM-DD in user's local day
  value: { type: Number, default: 1 }, // boolean as 1/0, or numeric for quantity
  skipped: { type: Boolean, default: false },
  meta: { type: Object, default: null }
});

entrySchema.index({ userId: 1, habitId: 1, dayKey: 1 }, { unique: true });

export default mongoose.model("Entry", entrySchema);
