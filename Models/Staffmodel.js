const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  Casualleave: {
    type: Number,
    required: true,
  },
  Medicalleave: {
    type: Number,
    required: true,
  },
});

const Staffdetails = mongoose.model("Staffdetails", staffSchema);

module.exports = Staffdetails;
