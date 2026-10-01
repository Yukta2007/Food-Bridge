import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import organizerRoutes from "./routes/organizerRoutes.js";
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/organizations", organizationRoutes);
app.use("/api/organizers", organizerRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "FoodBridge backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});