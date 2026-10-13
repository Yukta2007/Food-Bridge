
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import organizerRoutes from "./routes/organizerRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/organizations", organizationRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "FoodBridge backend is running",
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Connect database and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`FoodBridge server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
