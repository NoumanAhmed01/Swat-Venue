const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Venue = require("../models/Venue");
const Review = require("../models/Review");
const Menu = require("../models/Menu");
const Booking = require("../models/Booking");

dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const realVenues = [
  {
    name: "Nakreezay Event complex ^ wedding hall Najib Abad",
    phone: "+92 340 9553001",
    address: "Qamber Bypass road, Swat Mingora, 19130, Pakistan",
    location: "Mingora",
  },
  {
    name: "Balana Shadi Hall",
    phone: "+92 344 9309994",
    address: "Kabal Rd, Swat Kabal, 19200, Pakistan",
    location: "Kabal",
  },
  {
    name: "Qasar-e-Noor Wedding Hall",
    phone: "+92 341 0711212",
    address: "Haji Baba - Buner Rd, Mingora, Pakistan",
    location: "Mingora",
  },
  {
    name: "Rangoona Shadi Hall",
    phone: "+92 346 9447426",
    address: "R824+34R, Swat Kabal, 19060, Pakistan",
    location: "Kabal",
  },
  {
    name: "Khadee Wedding Hall",
    phone: "+92 300 5936631",
    address: "Wahab nagarSwat, Swat Mingora, 19200, Pakistan",
    location: "Mingora",
  },
  {
    name: "Sagar shaadi hall",
    phone: "+92 318 9018183",
    address: "Bahrain Rd, Swat Balogram, Pakistan",
    location: "Balogram",
  },
  {
    name: "Nakreezay Banquet najib abad",
    phone: "+92 340 9553001",
    address: "Q8FJ+JQV Bypass, Swat Rahimabad, Mingora, Pakistan",
    location: "Rahimabad",
  },
  {
    name: "Deewa Shadi Hall",
    phone: "+92 310 6664442",
    address: "Q8QW+962, Bahrain Rd, Swat Mingora, Pakistan",
    location: "Mingora",
  },
  {
    name: "Elegant shadi hall",
    phone: "+92 344 9660700",
    address: "Mingora Bypass, Swat Mingora, swat, Pakistan",
    location: "Mingora",
  },
  {
    name: "DEHLEEZ WEDDING HALL",
    phone: "+92 304 2448000",
    address: "PANR ROAD BATTI STOP RASHAGHAT Batti, stop Rashgata, Mingora, 19130, Pakistan",
    location: "Mingora",
  },
  {
    name: "Arena wedding hall",
    phone: "+92 304 9283949",
    address: "Swat arena wedding hall, Swat Mingora, Pakistan",
    location: "Mingora",
  },
  {
    name: "Hurain Banquet",
    phone: "+92 946 712122",
    address: "Faizabad, Saidu Sharif Rd, Saidu Sharif, Pakistan",
    location: "Saidu Sharif",
  },
  {
    name: "Sky shaadi hall",
    phone: "+92 334 9171100",
    address: "Q857+CF2, Swat Mingora, 19200, Pakistan",
    location: "Mingora",
  },
  {
    name: "Elegant Shadi Hall",
    phone: "+92 300 0000000",
    address: "Q8FM+R52 qamber chawak, bay pass road, Swat Mingora, Dandonoqala, Pakistan",
    location: "Mingora",
  },
  {
    name: "Gudar Wedding Hall",
    phone: "+92 313 3353636",
    address: "Chota Kalam, Matta Road, Swat Ningolai, Pakistan",
    location: "Ningolai",
  },
  {
    name: "Arena Shadi Hall",
    phone: "+92 300 0000000",
    address: "Q9VW+57, Swat, Pakistan",
    location: "Mingora",
  },
];

const dummyImages = [
  "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
  "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg",
  "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg",
  "https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg",
  "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
  "https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg",
  "https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg",
];

const amenitiesList = ["AC", "Parking", "Catering", "Sound System", "Stage", "WiFi", "VIP Lounge", "Valet Parking", "Bridal Suite", "Garden Setting"];

const seedRealVenues = async () => {
  try {
    await connectDB();

    // Clean existing data
    await Booking.deleteMany();
    await Venue.deleteMany();
    await Menu.deleteMany();
    await Review.deleteMany();
    console.log("Old venue data destroyed...");

    const owners = await User.find({ role: "owner" });
    const customers = await User.find({ role: "customer" });

    if (owners.length === 0 || customers.length === 0) {
      console.error("Please run the initial seed first to create owners and customers.");
      process.exit(1);
    }

    // Clear venues array for all users first
    await User.updateMany({}, { $set: { venues: [] } });

    for (let i = 0; i < realVenues.length; i++) {
      const v = realVenues[i];
      const owner = owners[i % owners.length];
      
      const price = Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000;
      const capacity = Math.floor(Math.random() * (800 - 300 + 1)) + 300;
      const images = [...dummyImages].sort(() => 0.5 - Math.random()).slice(0, 3);
      const amenities = [...amenitiesList].sort(() => 0.5 - Math.random()).slice(0, 5);

      const venue = await Venue.create({
        name: v.name,
        location: v.location,
        address: v.address,
        capacity: capacity,
        price: price,
        priceType: "per day",
        rating: (Math.random() * (5 - 4) + 4).toFixed(1),
        reviews: 2,
        images: images,
        amenities: amenities,
        description: `${v.name} is one of the premier event spaces in ${v.location}, Swat. Known for its excellent service and beautiful ambiance.`,
        owner: owner._id,
        ownerName: owner.name,
        phone: v.phone,
        status: "approved",
      });

      await User.findByIdAndUpdate(owner._id, { $push: { venues: venue._id } });

      // Create Standard Menus
      const menu1 = await Menu.create({
        name: "Silver Package",
        pricePerHead: 1200,
        items: ["Chicken Biryani", "Chicken Qorma", "Raita & Salad", "Nan"],
        venue: venue._id,
      });

      const menu2 = await Menu.create({
        name: "Gold Package",
        pricePerHead: 1800,
        items: ["Mutton Pulao", "Chicken Karahi", "Seekh Kabab", "Soft Drinks"],
        venue: venue._id,
      });

      // Create dummy reviews (Requires a Booking first)
      const randomCustomers = [...customers].sort(() => 0.5 - Math.random()).slice(0, 2);
      for (let j = 0; j < randomCustomers.length; j++) {
        const customer = randomCustomers[j];
        const selectedMenu = j === 0 ? menu1 : menu2;
        
        // Create a completed booking
        const booking = await Booking.create({
          venue: venue._id,
          customer: customer._id,
          customerName: customer.name,
          eventDate: new Date(Date.now() - (j + 1) * 86400000), // Past date
          eventType: "Wedding",
          guestCount: 200,
          menu: selectedMenu._id,
          menuDetails: {
            name: selectedMenu.name,
            pricePerHead: selectedMenu.pricePerHead
          },
          pricePerHead: selectedMenu.pricePerHead,
          totalAmount: selectedMenu.pricePerHead * 200,
          status: "completed",
          phone: "+92 300 0000000",
          email: customer.email || "customer@example.com",
        });

        // Create Review referencing that booking
        await Review.create({
          venue: venue._id,
          customer: customer._id,
          booking: booking._id,
          customerName: customer.name,
          rating: Math.floor(Math.random() * (5 - 4 + 1)) + 4,
          comment: `Great experience at ${v.name}. The arrangements were perfect!`,
          eventType: "Wedding",
        });
      }

      console.log(`Seeded: ${v.name}`);
    }

    console.log("Real venue data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedRealVenues();
