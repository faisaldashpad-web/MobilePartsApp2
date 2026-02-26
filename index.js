const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Error connecting:", err));

// Item Schema (30 days expiry)
const itemSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  condition: String,
  sellerName: String,
  whatsapp: String,
  image: String,
  createdAt: { type: Date, default: Date.now, expires: '30d' }
});

const Item = mongoose.model('Item', itemSchema);

// Route to Add Item
app.post('/add', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).send({ message: "Successfully Added" });
  } catch (e) { res.status(500).send(e); }
});

// Route to Get All Items
app.get('/list', async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
