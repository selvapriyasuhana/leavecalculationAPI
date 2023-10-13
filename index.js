var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const cors = require("cors");

var app = new express();
var StaffRoutes = require("./Routes/Staffroutes.js");
var LeaveRoutes = require("./Routes/Leaveroutes.js");
var mongodb = require("./Config.js/Mongoconfig.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const mongo = mongoose.connect(mongodb.url);
mongo.then(
  () => {
    console.log("Mongo_DB Connected Successfully");
  },
  (error) => {
    console.log(
      error,
      "Error, While connecting to Mongo_DB somthing went wrong"
    );
  }
);

var port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});

app.get("/", (req, res) => res.send("Welcome to  staff Signin Page"));

app.use("/Staff", StaffRoutes);
app.use("/Leave", LeaveRoutes);
module.exports = app;
