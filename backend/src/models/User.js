import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  timezone: { type: String, default: "UTC" },
  dayStartHour: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
