const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    //unique: false,
  },
  Name: {
    type: String,
    required: true,
  },
  Leavetype: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  Numberofdays: {
    type: Number,
    required: true,
  },
  Reason: {
    type: String,
    required: false,
  },
  Command: {
    type: String,
    required: false,
  },
  Status: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
