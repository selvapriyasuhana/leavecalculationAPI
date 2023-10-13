const router = require("express").Router();
const Leave = require("../Models/Leavemodel.js");
const Staffdetails = require("../Models/Staffmodel.js");

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Staff leave API",
  });
});

router.post("/register", async (req, res) => {
  try {
    const {
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Reason,
      Command,
      Status,
    } = req.body;

    // Check if the staff member (username) exists in the "StaffDetails" collection
    const staffMember = await Staffdetails.findOne({ username });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }
    if (Leavetype !== "Casualleave" && Leavetype !== "Medicalleave") {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    if (staffMember[Leavetype] < Numberofdays) {
      return res.status(400).json({
        message: `Insufficient ${Leavetype} balance for leave request.`,
      });
    }
    const staff = Leave({
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Reason,
      Command,
      Status,
    });

    await staff.save();
   // staffMember[Leavetype] -= Numberofdays;
    //await staffMember.save();

    return res.json({
      message: "New staff leaverequest",
      data: staff,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate leave request detected." });
    }
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

const Leavecontroller = require("../Controller/Leavecontroller.js");
router.route("/user/get_all").get(Leavecontroller.index);
router.route("/user/id/:user_id").get(Leavecontroller.view);
router.route("/:user_id").put(Leavecontroller.update);
router.route("/:user_id").patch(Leavecontroller.update);
router.route("/:user_id").delete(Leavecontroller.Delete);

module.exports = router;
