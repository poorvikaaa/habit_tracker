import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/habit-tracker-dev"
};
