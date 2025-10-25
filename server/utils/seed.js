const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Venue = require("../models/Venue");
const Review = require("../models/Review");

// utils/seed.js
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Venue.deleteMany();
    await Review.deleteMany();

    console.log("Data destroyed...");

    const admin = await User.create({
      name: "Admin User",
      email: "admin@swatvenue.com",
      password: "password",
      phone: "+92-300-0000000",
      role: "admin",
    });

    const owner1 = await User.create({
      name: "Ahmad Khan",
      email: "owner@swatvenue.com",
      password: "password",
      phone: "+92-300-1234567",
      role: "owner",
    });

    const owner2 = await User.create({
      name: "Fazal Din",
      email: "fazal@example.com",
      password: "password",
      phone: "+92-300-2345678",
      role: "owner",
    });

    const owner3 = await User.create({
      name: "Malik Hassan",
      email: "hassan@example.com",
      password: "password",
      phone: "+92-300-3456789",
      role: "owner",
    });

    const owner4 = await User.create({
      name: "Rahman Shah",
      email: "rahman@example.com",
      password: "password",
      phone: "+92-300-4567890",
      role: "owner",
    });

    const customer = await User.create({
      name: "Customer User",
      email: "customer@swatvenue.com",
      password: "password",
      phone: "+92-300-9876543",
      role: "customer",
    });

    console.log("Users created...");

    const venue1 = await Venue.create({
      name: "Royal Banquet Hall",
      location: "Mingora, Swat",
      address: "Green Chowk, Mingora, Swat, KPK",
      capacity: 500,
      price: 75000,
      priceType: "per day",
      rating: 4.8,
      reviews: 4,
      images: [
        "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
        "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg",
        "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg",
      ],
      amenities: ["AC", "Parking", "Catering", "Sound System", "Stage", "WiFi"],
      description:
        "Elegant banquet hall perfect for weddings and large events. Features traditional architecture with modern amenities.",
      owner: owner1._id,
      ownerName: owner1.name,
      phone: owner1.phone,
      status: "approved",
    });

    const venue2 = await Venue.create({
      name: "Mountain View Resort",
      location: "Kalam, Swat",
      address: "Upper Kalam, Swat Valley, KPK",
      capacity: 200,
      price: 45000,
      priceType: "per day",
      rating: 4.6,
      reviews: 3,
      images: [
        "https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg",
        "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
        "https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg",
      ],
      amenities: [
        "Mountain View",
        "Garden",
        "Catering",
        "Parking",
        "Photography Area",
      ],
      description:
        "Scenic outdoor venue with breathtaking mountain views. Perfect for intimate gatherings and destination events.",
      owner: owner2._id,
      ownerName: owner2.name,
      phone: owner2.phone,
      status: "approved",
    });

    const venue3 = await Venue.create({
      name: "Grand Palace Hall",
      location: "Saidu Sharif, Swat",
      address: "Main Bazaar, Saidu Sharif, Swat, KPK",
      capacity: 800,
      price: 120000,
      priceType: "per day",
      rating: 4.9,
      reviews: 3,
      images: [
        "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg",
        "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
        "https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg",
      ],
      amenities: [
        "AC",
        "VIP Lounge",
        "Valet Parking",
        "Full Catering",
        "Bridal Suite",
        "Sound & Lights",
        "WiFi",
      ],
      description:
        "Luxurious banquet hall with opulent interiors and world-class facilities. The premier venue for grand celebrations.",
      owner: owner3._id,
      ownerName: owner3.name,
      phone: owner3.phone,
      status: "approved",
    });

    const venue4 = await Venue.create({
      name: "Garden Pavilion",
      location: "Bahrain, Swat",
      address: "Riverside, Bahrain, Swat Valley, KPK",
      capacity: 150,
      price: 35000,
      priceType: "per day",
      rating: 4.4,
      reviews: 2,
      images: [
        "https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg",
        "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
        "https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg",
      ],
      amenities: [
        "Garden Setting",
        "Riverside View",
        "BBQ Area",
        "Parking",
        "Basic Sound System",
      ],
      description:
        "Charming garden venue by the riverside. Ideal for small gatherings and outdoor celebrations.",
      owner: owner4._id,
      ownerName: owner4.name,
      phone: owner4.phone,
      status: "approved",
    });

    await User.findByIdAndUpdate(owner1._id, { $push: { venues: venue1._id } });
    await User.findByIdAndUpdate(owner2._id, { $push: { venues: venue2._id } });
    await User.findByIdAndUpdate(owner3._id, { $push: { venues: venue3._id } });
    await User.findByIdAndUpdate(owner4._id, { $push: { venues: venue4._id } });

    console.log("Venues created...");

    await Review.create([
      {
        venue: venue1._id,
        customer: customer._id,
        customerName: "Ahmad Hassan",
        rating: 5,
        comment:
          "Absolutely stunning venue! The Royal Banquet Hall exceeded all our expectations for our wedding.",
        eventType: "Wedding",
      },
      {
        venue: venue1._id,
        customer: customer._id,
        customerName: "Fatima Khan",
        rating: 4,
        comment:
          "Great venue with excellent facilities. The sound system was top-notch.",
        eventType: "Corporate Event",
      },
      {
        venue: venue2._id,
        customer: customer._id,
        customerName: "Hassan Ali",
        rating: 5,
        comment:
          "Mountain View Resort is absolutely breathtaking! The natural beauty combined with excellent service made our wedding unforgettable.",
        eventType: "Wedding",
      },
      {
        venue: venue3._id,
        customer: customer._id,
        customerName: "Sana Ahmed",
        rating: 5,
        comment:
          "Grand Palace Hall is truly grand! The luxurious interiors and world-class facilities made our wedding reception absolutely perfect.",
        eventType: "Wedding",
      },
    ]);

    console.log("Reviews created...");
    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
