const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // MiddWare
app.use("/", route); // MiddleWare

// Database Connection

mongoose
  .connect(
    "mongodb+srv://harikushwah519:dKJ653fvjjChiNPY@cluster0.kiovfe6.mongodb.net/E-commerce"
  )
  .then(() => console.log("MongooseDB Connected"))
  .catch(() => console.log("MongooseDB  Connection Failed"));

// Creating Server

app.get("/", (req, res) => {
  res.send("Hello From Express Js");
});

let PORT = 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(Error);
  } else {
    console.log(`Server is Running at PORT ${4000}`);
  }
});
