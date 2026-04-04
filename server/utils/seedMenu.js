const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Venue = require("../models/Venue");
const Menu = require("../models/Menu");

dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const seedMenus = async () => {
  try {
    await connectDB();

    // ❗ DON'T DELETE VENUES
    await Menu.deleteMany();
    console.log("Old menus removed...");

    const venues = await Venue.find();

    if (!venues.length) {
      console.log("No venues found. Run seed first.");
      process.exit();
    }

    // 🔥 COMMON MENUS (your real data)
    const menuTemplates = [
      {
        name: "Mehendi Menu",
        pricePerHead: 1250,
        items: [
          "Tea",
          "Chicken Dhaka / Chicken Piece",
          "Shami Kabab",
          "Biscuit",
          "Samosa",
          "Samosa Roll",
          "Namak Para",
          "Cold Drinks",
          "Mineral Water",
        ],
        category: "mehendi",
      },
      {
        name: "Menu No 1",
        pricePerHead: 1350,
        items: [
          "Brown Rice / Vegetable Fried Rice",
          "Chicken Qorma / Kofta Curry",
          "Mix Vegetable / Chana Masala",
          "Nan",
          "Raita",
          "Fresh Salad",
          "Mineral Water",
        ],
      },
      {
        name: "Menu No 2",
        pricePerHead: 1450,
        items: [
          "Zeera Polaw / Yakhni Polaw",
          "Chicken Roast",
          "Mix Vegetable / Alo Palak",
          "Nan",
          "Raita",
          "Fresh Salad",
          "Kheer / Custard",
          "Cold Drinks",
          "Mineral Water",
        ],
      },
      {
        name: "Menu No 3",
        pricePerHead: 1550,
        items: [
          "Matar Polaw",
          "Chicken Steam Roast",
          "White Meat",
          "Alo Palak",
          "Nan",
          "Raita",
          "Fresh Salad",
          "Kheer",
          "Green Tea",
          "Cold Drinks",
        ],
      },
      {
        name: "Menu No 4",
        pricePerHead: 1650,
        items: [
          "Kabuli Polaw / Biryani",
          "White Meat",
          "Chicken Roast",
          "Seekh Kabab",
          "Mix Sabzi",
          "Nan",
          "Raita",
          "Russian Salad",
          "Kheer",
          "Cold Drinks",
        ],
      },
      {
        name: "Menu No 5",
        pricePerHead: 1750,
        items: [
          "Kabuli Polaw",
          "White Qorma",
          "Chicken Boti",
          "Seekh Kabab",
          "Chicken Handi",
          "Mix Vegetable",
          "Nan",
          "Raita",
          "Dessert",
          "Cold Drinks",
        ],
      },
      {
        name: "Menu No 6",
        pricePerHead: 1840,
        items: [
          "Kabuli Polaw",
          "White Qorma",
          "Chicken Steam Roast",
          "Seekh Kabab",
          "Fried Fish",
          "Saag",
          "Nan",
          "Zarda",
          "Salad",
          "Kheer",
          "Cold Drinks",
        ],
      },
    ];

    // 🔥 LOOP → ADD MENUS TO EACH VENUE
    for (const venue of venues) {
      const menus = menuTemplates.map((menu) => ({
        ...menu,
        venue: venue._id, // link menu to venue
      }));

      await Menu.insertMany(menus);
      console.log(`Menus added for ${venue.name}`);
    }

    console.log("Menus seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedMenus();
