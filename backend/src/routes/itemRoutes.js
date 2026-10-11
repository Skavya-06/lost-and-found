const express = require("express");
const {
  getItems,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem,
} = require("../controllers/itemController");
const {
  authenticateUser,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public item listing with filters
router.get("/", getItems);

// Current user's items (requires login)
router.get("/mine", authenticateUser, getMyItems);

// Single item details
router.get("/:id", getItemById);

// Create report (requires login)
router.post("/", authenticateUser, createItem);

// Update item details (Owner or Admin)
router.put("/:id", authenticateUser, updateItem);

// Update item lifecycle status (Admin)
router.put("/:id/status", authenticateUser, requireAdmin, updateItemStatus);

// Delete report (Owner or Admin)
router.delete("/:id", authenticateUser, deleteItem);

module.exports = router;
