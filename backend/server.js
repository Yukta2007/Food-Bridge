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

/* ================= DATABASE ================= */

connectDB();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json({ limit: "10kb" }));

/* ================= ROUTES ================= */

app.use("/api/organizations", organizationRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.json({
    message: "FoodBridge backend is running",
  });
});

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    message:
      err.message || "Something went wrong on the server.",
  });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});