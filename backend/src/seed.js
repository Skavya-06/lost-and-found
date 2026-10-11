const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const Item = require("./models/Item");

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lost-and-found";
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log("Cleared existing Users and Items.");

    // Create Admin and User passwords
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Admin User
    const adminUser = await User.create({
      name: "Team Admin",
      email: "admin@findit.com",
      password: hashedPassword,
      role: "admin",
    });

    // Create Standard Demo User
    const demoUser = await User.create({
      name: "John Doe",
      email: "user@findit.com",
      password: hashedPassword,
      role: "user",
    });

    console.log("✅ Seeded Users:");
    console.log("   - Admin: admin@findit.com / password123");
    console.log("   - User:  user@findit.com / password123");

    // Seed Items
    const sampleItems = [
      {
        title: "Blue Herschel Classic Backpack",
        type: "FOUND",
        category: "Bags & Backpacks",
        status: "OPEN",
        description: "Dark blue backpack with brown leather accents. Contains a spiral notebook and water bottle.",
        location: "Central Library, 2nd Floor Study Room 204",
        date: "2026-10-10",
        contact: "library-frontdesk@campus.edu",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        user: adminUser._id,
      },
      {
        title: "iPhone 14 Pro (Space Black)",
        type: "LOST",
        category: "Electronics",
        status: "OPEN",
        description: "Has a transparent case with a green dinosaur sticker on the back. Lock screen shows a mountain wallpaper.",
        location: "Campus Dining Hall, Booth 12",
        date: "2026-10-09",
        contact: "john.doe@student.edu | +1-555-0199",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
        user: demoUser._id,
      },
      {
        title: "Student ID Card & Dorm Keycard",
        type: "FOUND",
        category: "Cards & IDs",
        status: "CLAIMED",
        description: "University Student ID inside a black lanyard along with an RFID dorm access keycard.",
        location: "Engineering Hallway, Room 302 Bench",
        date: "2026-10-08",
        contact: "security@campus.edu",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
        user: adminUser._id,
      },
      {
        title: "Sony WH-1000XM5 Wireless Headphones",
        type: "LOST",
        category: "Electronics",
        status: "OPEN",
        description: "Black over-ear headphones inside their original grey carrying case with USB-C cable.",
        location: "Sports Complex / Gym Locker Area",
        date: "2026-10-10",
        contact: "user@findit.com",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        user: demoUser._id,
      },
      {
        title: "Fossil Brown Leather Bi-fold Wallet",
        type: "FOUND",
        category: "Wallets & Purses",
        status: "OPEN",
        description: "Dark brown leather wallet with initials 'M.K.' embossed. Handed to security guard.",
        location: "Student Union Lounge near coffee shop",
        date: "2026-10-11",
        contact: "union-security@campus.edu",
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
        user: adminUser._id,
      },
      {
        title: "Car Keys with Subaru Key Fob",
        type: "LOST",
        category: "Keys",
        status: "CLOSED",
        description: "Set of 3 brass keys and one black Subaru remote fob with a red miniature carabiner.",
        location: "North Lot 4, Row C",
        date: "2026-10-06",
        contact: "john.doe@student.edu",
        imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
        user: demoUser._id,
      },
    ];

    await Item.insertMany(sampleItems);
    console.log(`✅ Seeded ${sampleItems.length} initial items!`);
    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
