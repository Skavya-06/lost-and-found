const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["LOST", "FOUND"],
        message: "Type must be either LOST or FOUND",
      },
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "General",
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["OPEN", "CLAIMED", "CLOSED"],
        message: "Status must be OPEN, CLAIMED, or CLOSED",
      },
      default: "OPEN",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    contact: {
      type: String,
      required: [true, "Contact information is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reporter reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Item", itemSchema);
