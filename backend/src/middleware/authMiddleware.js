const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not logged in. Authorization token required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretlostandfoundjwtkey_2026"
    );

    // Attach user payload
    req.user = {
      id: decoded.id,
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware to restrict access to Admin role only
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only. Permission denied." });
  }
  next();
};

module.exports = { authenticateUser, requireAdmin };
