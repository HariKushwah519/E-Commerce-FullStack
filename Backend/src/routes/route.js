const express = require("express");
const Route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

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
  getProductsByQuery,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

Route.post("/addProduct", authMiddleware, addProduct);
Route.get("/productDetails", getProducts);
Route.get("/getProduct/:id", getProductById);
Route.get("/getProductsByQuery", getProductsByQuery);
Route.put("/updateProduct/:id", authMiddleware, updateProduct);
Route.delete("/deleteProduct/:id", authMiddleware, deleteProduct);

// Cart

const {
  addToCart,
  getCart,
  updateCart,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

Route.post("/addToCart", authMiddleware, addToCart);
Route.get("/cartDetails", authMiddleware, getCart);
Route.put("/updateCart", authMiddleware, updateCart);
Route.delete("/removeItem/:productId", authMiddleware, removeItemFromCart);
Route.delete("/clearCart", authMiddleware, clearCart);

// Order

const {
  placeOrder,
  getMyOrder,
  cancelOrder,
} = require("../controllers/orderController");

Route.post("/placeOrder", authMiddleware, placeOrder);
Route.get("/orderDetails", authMiddleware, getMyOrder);
Route.delete("/cancelOrder/:id", authMiddleware, cancelOrder);

module.exports = Route;
