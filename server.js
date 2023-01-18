const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const cors = require("cors");
const passport = require("passport");
const passportJwt = require("./config/passport-jwt");
const router = require("./router/index");
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");
const dotenv = require("dotenv");

dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(passport.initialize());

app.use(router);

module.exports.startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost/rolebase-auth-db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    await app.listen(port, function (err) {
      console.log("connected to port", port);
    });
  } catch (error) {
    console.log("error", error);
  }
};
