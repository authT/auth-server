require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { auth } = require("./routes/auth");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "auth-session",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", auth);

// connect to database and start server
const start = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("db connected successfuly");
      app.listen(port, () => console.log(`server is running on port ${port}`));
    })
    .catch((err) => {
      console.log(err);
    });
};

start();
