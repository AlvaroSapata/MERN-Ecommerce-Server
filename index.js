// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
const port = 4000;

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//* -------- Database Connection With MongoDB -------- *//
// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Ecommerce";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
  
  //* ------------------   Models   ------------------ *//
  // ℹ️ Schema for creating user model
  const Users = mongoose.model("Users", {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    cartData: {
      type: Object,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  // ℹ️ Schema for creating Product
  const Product = mongoose.model("Product", {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    new_price: {
      type: Number
    },
    old_price: {
      type: Number
    },
    date: {
      type: Date,
      default: Date.now,
    },
    avilable: {
      type: Boolean,
      default: true,
    },
  });


app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
