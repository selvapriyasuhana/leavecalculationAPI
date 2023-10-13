const Service = require("../Service/Leaveservice.js");

exports.index = async (req, res) => {
  try {
    const staff = await Service.Service_index();
    res.json({
      status: "Success",
      message: "ALL staff leave requests retrieved successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.view = async (req, res) => {
  try {
    const staff = await Service.Service_view(req.params.user_id);
    if (!staff) {
      return res.json({
        status: "Error",
        message: "Staff  id not found",
      });
    }
    res.json({
      status: "Success",
      message: "staff leaverequest details GET by _id successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const mongoose = require("mongoose");
const Staffmodel = require("../Models/Staffmodel.js");
const Leavemodel = require("../Models/Leavemodel.js");
exports.update = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { Command, Status, Leavetype, Numberofdays } = req.body;

    // Update the leave request status and command
    const updatedLeave = await Service.Service_update(user_id, {
      Leavetype,
      Command,
      Status,
    });

    if (!updatedLeave) {
      return res.json({
        status: "Error",
        message: "Leave request not found",
      });
    }

    // If the leave request is approved, deduct the leaves from the user's record
    if (Status === "accepted") {
      const username = updatedLeave.username;
      const existingStaff = await Staffmodel.findOne({ username });

      if (!existingStaff) {
        return res.json({
          status: "Error",
          message: "Staff record not found",
        });
      }

      const user = await Staffmodel.findOne({
        username: updatedLeave.username,
      });

      if (!user) {
        return res.json({
          status: "Error",
          message: "User record not found",
        });
      }
      console.log("Leavetype:", Leavetype);
      
      if (Leavetype === "Casualleave") {
        user.Casualleave -= Numberofdays;

        if (user.Casualleave < 0) {
          return res.json({
            status: "Error",
            message: "Casual Leave balance is insufficient",
          });
        }
      } else if (Leavetype === "Medicalleave") {
        user.Medicalleave -= Numberofdays;

        if (user.Medicalleave < 0) {
          return res.json({
            status: "Error",
            message: "Medical Leave balance is insufficient",
          });
        }
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }
           // Save the updated user record in the "users" collection
      await user.save();
    }
    
    // Update the leave record in the "leaves" collection using Mongoose
    const leave = await Leavemodel.findByIdAndUpdate(
      user_id,
      {
        Command,
        Status,
      },
      { new: true }
    );

    res.json({
      status: "Success",
      message: "Leave request updated successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while processing the request",
    });
  }
};

exports.Delete = async (req, res) => {
  try {
    const deletedCount = await Service.Service_Delete(req.params.user_id);
    if (deletedCount === 0) {
      return res.json({
        status: "Error",
        message: " Given staff id not found for deleting",
      });
    }
    res.json({
      status: "Success",
      message: "Given staff id leave request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
