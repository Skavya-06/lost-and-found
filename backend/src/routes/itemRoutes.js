const express = require("express");
const {
  getItems,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// General listing
router.get("/", getItems);

// Current user's items (requires login)
router.get("/mine", authenticateUser, getMyItems);

// Single item details
router.get("/:id", getItemById);

// Create report (requires login)
router.post("/", authenticateUser, createItem);

// Update user's own report (Owner)
router.put("/:id", authenticateUser, updateItem);

// Delete user's own report (Owner)
router.delete("/:id", authenticateUser, deleteItem);

module.exports = router;
