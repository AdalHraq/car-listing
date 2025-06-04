// Load dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connects to MongoDB with logging
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Define Car model
const Car = mongoose.model("Car", {
  title: String,
  location: String,
  price: Number,
  latitude: Number,
  longitude: Number,
  image: String,
  dateAdded: String,
  timeAdded: String,
});

// ✅ GET /cars route
app.get("/cars", async (req, res) => {
  const { search = "", minPrice = 0, maxPrice = 100000 } = req.query;

  try {
    const cars = await Car.find({
      title: { $regex: search, $options: "i" },
      price: { $gte: minPrice, $lte: maxPrice },
    });
    res.json(cars);
  } catch (err) {
    res.status(500).send("Error loading cars: " + err.message);
  }
});

app.get("/seed", async (req, res) => {
  try {
    await Car.deleteMany();
    await Car.insertMany([
      {
        title: "BMW 3 Series",
        location: "London",
        price: 75,
        latitude: 51.5074,
        longitude: -0.1278,
        image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        dateAdded: "2025-06-03",
        timeAdded: "16:45",
      },
      {
        title: "Toyota Yaris",
        location: "Birmingham",
        price: 30,
        latitude: 52.4862,
        longitude: -1.8904,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2020_Toyota_Yaris_Design_HEV_CVT_1.5_Front.jpg/1200px-2020_Toyota_Yaris_Design_HEV_CVT_1.5_Front.jpg",
        dateAdded: "2025-06-04",
        timeAdded: "14:00",
      },
      {
        title: "Audi A3",
        location: "Manchester",
        price: 60,
        latitude: 53.4808,
        longitude: -2.2426,
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/80/Audi_-_A3_-_Mondial_de_l%27Automobile_de_Paris_2012_-_209.jpg",
        dateAdded: "2025-06-04",
        timeAdded: "09:00",
      },
      {
        title: "Volkswagen Golf",
        location: "Leeds",
        price: 45,
        latitude: 53.8008,
        longitude: -1.5491,
        image: "https://upload.wikimedia.org/wikipedia/commons/7/78/2020_Volkswagen_Golf_Style_TDi_S-A_2.0.jpg",
        dateAdded: "2025-06-04",
        timeAdded: "10:15",
      },
    ]);
    res.send("Database seeded with working car images!");
  } catch (err) {
    res.status(500).send("Seeding failed: " + err.message);
  }
});


app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});


