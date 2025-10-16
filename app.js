const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const User = require("./models/User");
require("dotenv").config();
// const Otp = require("./models/Otp");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("Toumai Solutions API is running ✅");
});

// Database en ligne

if (process.env.NODE_ENV === "production") {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ DB connection error:", err));
}

  // utilisation de la base de donnee en local
  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ DB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/projects", require("./routes/projectRoutes"));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
