const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "FindIt - Lost & Found Management System API",
    status: "online",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (Protected)",
      },
      items: {
        list: "GET /api/items",
        mine: "GET /api/items/mine (Protected)",
        detail: "GET /api/items/:id",
        create: "POST /api/items (Protected)",
        update: "PUT /api/items/:id (Owner/Admin)",
        updateStatus: "PUT /api/items/:id/status (Admin)",
        delete: "DELETE /api/items/:id (Owner/Admin)",
      },
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `API endpoint '${req.originalUrl}' not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Lost & Found API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/api`);
});
