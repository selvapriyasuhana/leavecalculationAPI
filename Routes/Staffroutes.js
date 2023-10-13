const router = require("express").Router();
const User = require("../Models/Staffmodel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");

router.get("/start", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome Staff signin API",
  });
});
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const decryptedPassword = cryptr.decrypt(user.password);

    if (decryptedPassword === password) {
      return res.json({
        message: "Signin successful",
        data: user,
      });
    } else {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { password, username, email, Casualleave, Medicalleave } = req.body;

    const encryptedPassword = cryptr.encrypt(password);

    const user = new User({
      password: encryptedPassword,
      username,
      email,
      Casualleave,
      Medicalleave,
    });

    await user.save();

    return res.json({
      message: "Registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

const Staffcontroller = require("../Controller/Staffcontroller.js");
router.route("/user").get(Staffcontroller.index);

router.route("/balance/:username").get(Staffcontroller.see);

router
  .route("/user/:username")
  .get(Staffcontroller.view)
  .patch(Staffcontroller.update)
  .put(Staffcontroller.update)
  .delete(Staffcontroller.Delete);
module.exports = router;
