const express = require("express");
const {
  github,
  google,
  login,
  signup,
} = require("../controllers/auth.controller");

const route = express.Router();

route.get("/github", github);
route.get("/google", google);
route.post("/login", login);
route.post("/signup", signup);

exports.auth = route;
