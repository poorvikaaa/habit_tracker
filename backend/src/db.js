import mongoose from "mongoose";

export default function connectDb(uri) {
  mongoose.set("strictQuery", false);
  mongoose.connect(uri, { });
  mongoose.connection.on("connected", () => console.log("MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));
}
