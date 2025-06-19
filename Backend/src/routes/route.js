const express = require("express");
const Route = express.Router();

const authMiddleware = require("../middleware/authMiddleware")

const {
  addUsers,
  getUsers,
  updateUser,
  getUserByGender,
  deleteUser,
  loginUser,
} = require("../controllers/userController");


// User

Route.post("/addUser", addUsers);
Route.get("/getAllUsers", authMiddleware, getUsers);
Route.put("/updateUser/:id", authMiddleware, updateUser);
Route.get("/getUserByGender", getUserByGender);
Route.delete("/deleteUser/:id", authMiddleware, deleteUser);
Route.post("/login", loginUser);

// Product

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

Route.post("/addProduct", authMiddleware, addProduct);
Route.get("/productDetails", getProducts);
Route.get("/getProduct/:id", getProductById);
Route.put("/updateProduct/:id", authMiddleware, updateProduct);
Route.delete("/deleteProduct/:id", authMiddleware, deleteProduct);

module.exports = Route;
