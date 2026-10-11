const mongoose = require("mongoose");
const Item = require("../models/Item");

// @desc    Get all items with optional filters & search (Admin list / Catalog)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { type, status, category, search } = req.query;
    const filter = {};

    // Filter by type (LOST or FOUND)
    if (type && type.toUpperCase() !== "ALL") {
      filter.type = type.toUpperCase();
    }

    // Filter by status (OPEN, CLAIMED, CLOSED)
    if (status && status.toUpperCase() !== "ALL") {
      filter.status = status.toUpperCase();
    }

    // Filter by category
    if (category && category !== "ALL" && category !== "All Categories") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Search query matching title, description, or location
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    const items = await Item.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    console.error("getItems error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch items" });
  }
};

// @desc    Get items created by current logged-in user
// @route   GET /api/items/mine
// @access  Private (Logged-in user)
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    console.error("getMyItems error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch user items" });
  }
};

// @desc    Get single item details by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Item not found (invalid ID format)" });
    }

    const item = await Item.findById(id).populate("user", "name email role");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json(item);
  } catch (error) {
    console.error("getItemById error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch item details" });
  }
};

// @desc    Create a new item report
// @route   POST /api/items
// @access  Private (Logged-in user)
const createItem = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      location,
      date,
      description,
      contact,
      imageUrl,
      status,
    } = req.body;

    if (!title || !type || !location || !description) {
      return res.status(400).json({
        message: "Title, type, location, and description are required fields",
      });
    }

    const upperType = type.toUpperCase();
    if (!["LOST", "FOUND"].includes(upperType)) {
      return res.status(400).json({ message: "Type must be either LOST or FOUND" });
    }

    const newItem = new Item({
      title: title.trim(),
      type: upperType,
      category: category ? category.trim() : "General",
      location: location.trim(),
      date: date || new Date().toISOString().split("T")[0],
      description: description.trim(),
      contact: contact ? contact.trim() : req.user.email || "No contact specified",
      imageUrl: imageUrl ? imageUrl.trim() : "",
      status: status && ["OPEN", "CLAIMED", "CLOSED"].includes(status.toUpperCase())
        ? status.toUpperCase()
        : "OPEN",
      user: req.user.id,
    });

    const savedItem = await newItem.save();
    const populated = await Item.findById(savedItem._id).populate("user", "name email role");

    return res.status(201).json(populated);
  } catch (error) {
    console.error("createItem error:", error);
    return res.status(500).json({ message: error.message || "Failed to create item" });
  }
};

// @desc    Update an item report
// @route   PUT /api/items/:id
// @access  Private (Owner or Admin)
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Item not found" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check authorization: Owner or Admin
    const isOwner = item.user.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to update this item",
      });
    }

    const {
      title,
      type,
      category,
      location,
      date,
      description,
      contact,
      imageUrl,
      status,
    } = req.body;

    if (title !== undefined) item.title = title.trim();
    if (type !== undefined && ["LOST", "FOUND"].includes(type.toUpperCase())) {
      item.type = type.toUpperCase();
    }
    if (category !== undefined) item.category = category.trim();
    if (location !== undefined) item.location = location.trim();
    if (date !== undefined) item.date = date;
    if (description !== undefined) item.description = description.trim();
    if (contact !== undefined) item.contact = contact.trim();
    if (imageUrl !== undefined) item.imageUrl = imageUrl.trim();
    if (status !== undefined && ["OPEN", "CLAIMED", "CLOSED"].includes(status.toUpperCase())) {
      item.status = status.toUpperCase();
    }

    await item.save();
    const updated = await Item.findById(item._id).populate("user", "name email role");

    return res.json(updated);
  } catch (error) {
    console.error("updateItem error:", error);
    return res.status(500).json({ message: error.message || "Failed to update item" });
  }
};

// @desc    Update item status (Admin quick-update)
// @route   PUT /api/items/:id/status
// @access  Private (Admin)
const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!status || !["OPEN", "CLAIMED", "CLOSED"].includes(status.toUpperCase())) {
      return res.status(400).json({
        message: "Status must be either OPEN, CLAIMED, or CLOSED",
      });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = status.toUpperCase();
    await item.save();

    const updated = await Item.findById(item._id).populate("user", "name email role");
    return res.json(updated);
  } catch (error) {
    console.error("updateItemStatus error:", error);
    return res.status(500).json({ message: error.message || "Failed to update item status" });
  }
};

// @desc    Delete item report
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Item not found" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check authorization: Owner or Admin
    const isOwner = item.user.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to delete this item",
      });
    }

    await Item.findByIdAndDelete(id);

    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("deleteItem error:", error);
    return res.status(500).json({ message: error.message || "Failed to delete item" });
  }
};

module.exports = {
  getItems,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem,
};
