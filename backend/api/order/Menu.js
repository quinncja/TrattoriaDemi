const mongoose = require("mongoose");

const sauceSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const pastaSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const platterSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const optionSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const sizeSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  sizes: [sizeSchema],
  options: { type: [optionSchema], default: [] },
  sauces: [sauceSchema],
  pastas: [pastaSchema],
  platters: [platterSchema],
  price: Number,
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }, 
});

const sectionSchema = new mongoose.Schema({
  header: String,
  description: String,
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" }, 
});

const menuSchema = new mongoose.Schema({
  menuType: String,
  lastUpdated: Date,
});

const Item = mongoose.model("Item", itemSchema);
const Section = mongoose.model("Section", sectionSchema);
const Menu = mongoose.model("Menu", menuSchema);

module.exports = { Item, Section, Menu };
