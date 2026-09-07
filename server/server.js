require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const analyzeRoute = require("./routes/analyze");

const app = express();


// -------------------------
// CORS
// -------------------------

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);


// -------------------------
// Middleware
// -------------------------

app.use(express.json());


// -------------------------
// Rate Limiting
// -------------------------

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: "Too many analysis requests. Please try again later.",
  },
});


// -------------------------
// Routes
// -------------------------

app.use("/api/analyze", analyzeLimiter, analyzeRoute);

app.get("/", (req, res) => {
  res.json({
    message: "GitHub Repository Analyzer API is running",
  });
});


// -------------------------
// Server
// -------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});