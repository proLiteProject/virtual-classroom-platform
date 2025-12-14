import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js"; // 👈 important

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT 1 + 1 AS result");
  res.json({
    message: "Backend API running ✅",
    db: rows[0].result
  });
});

export default app;
