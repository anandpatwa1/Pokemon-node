const mongoose = require("mongoose");
const { get_current_date } = require("../assets/utils");

const pokemonSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'city',
  },
  created_at: {
    type: String,
    default: get_current_date()
  },
  updated_at: {
    type: String,
    default: get_current_date()
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
    default: 'ACTIVE'
  },
  views: {
    type: Number,
    default: 0
  },
  Name: {
    type: String,
  },
  breed: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  gallery: {
    type: Array,
  }
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

module.exports = Pokemon;
