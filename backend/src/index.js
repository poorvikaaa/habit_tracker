import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./db.js";
import config from "./config.js";
import habitsRouter from "./routes/habits.js";
import entriesRouter from "./routes/entries.js";
import mockAuth from "./middleware/mockAuth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect to Mongo
connectDb(config.MONGO_URI);

// simple mock auth (for MVP) - sets req.user
app.use(mockAuth);

// API routes
app.use("/api/habits", habitsRouter);
app.use("/api/entries", entriesRouter);

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = config.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
app.get("/", (req, res) => {
  res.send("Habit Tracker API — use /api/health or /api/habits");
});
