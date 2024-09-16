const mongoose = require('mongoose');
const { get_current_date } = require('../assets/utils');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  email_verified_at: {
    type: Date,
  },
  password: {
    type: String,
    required: true
  },
  remember_token: {
    type: String,
  },
  created_at: {
    type: String,
    default: get_current_date()
  },
  updated_at: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  mobile_number: {
    type: String,
  },
  country_code: {
    type: String,
  },
  address: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  token:{
    type: Array,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;