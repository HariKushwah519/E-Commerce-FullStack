const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const { isValid, isValidURL } = require("./validator");

// Add Products

const addProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (Object.keys(productData).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided!!!" });
    }

    const {
      productImage,
      productName,
      category,
      description,
      price,
      ratings,
      isFreeDelivery,
    } = productData;

    // Product Image Validation

    if (!isValid(productImage) || !isValidURL(productImage)) {
      return res.status(400).json({ msg: "Valid Product Image is Required" });
    }

    // Product Name Validation

    if (!isValid(productName)) {
      return res.status(400).json({ msg: "Product Name is required" });
    }

    let duplicateName = await productModel.findOne({ productName });
    if (duplicateName) {
      return res.status(400).json({ msg: "Product Already Exists" });
    }

    // Category Validation

    if (!isValid(category)) {
      return res.status(400).json({ msg: "Category is Required" });
    }

    let validCategory = [
      "electronics",
      "clothing",
      "food",
      "books",
      "furniture",
    ];
    if (!validCategory.includes(category.trim().toLowerCase())) {
      return res.status(400).json({
        msg: "Category must be 'electronics', 'clothing', 'food', 'books' and 'furniture' ",
      });
    }

    // Description Validation

    if (!isValid(description)) {
      return res.status(400).json({ msg: "Description is required" });
    }

    // Price Validation

    if (!isValid(price) || price < 0) {
      return res.status(400).json({ msg: "Valid Price is Required" });
    }

    // Rating Validation

    if (!isValid(ratings) || ratings < 0 || ratings > 5) {
      return res.status(400).json({ msg: "Valid Rating is Required" });
    }

    // isFreeDelivery Validation

    if (productData.hasOwnProperty(isFreeDelivery)) {
      if (isFreeDelivery !== "boolean") {
        return res
          .status(400)
          .json({ msg: "isFreeDelivery must be a Boolean Value " });
      }
    }

    const products = await productModel.create(productData);
    return res
      .status(201)
      .json({ msg: "Product Data Added Successfully", products });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: error.msg, error });
  }
};

// Get All Products

const getProducts = async (req, res) => {
  try {
    const productData = await productModel.find();

    if (productData.length === 0) {
      return res.status(404).json({ msg: "No Product Found" });
    }

    return res
      .status(200)
      .json({ msg: "Products List", count: productData.length, productData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error });
  }
};

// Get Product  By Id

const getProductById = async (req, res) => {
  try {
    let productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid Product Id" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product Not Found" });
    }

    return res.status(200).json({ msg: "Product Found", product });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Get Product By Query

const getProductsByQuery = async (req, res) => {
  try {
    let {
      productName,
      category,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      isFreeDelivery,
    } = req.query;

    if (Object.keys(req.query).length === 0) {
      return res
        .status(400)
        .json({ msg: "Please provide at least one query parameter" });
    }

    let filter = {};

    if (productName) {
      filter.productName = { $regex: productName, $options: "i" };
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (typeof minPrice !== "undefined" || typeof maxPrice !== "undefined") {
      filter.price = {};
      if (typeof minPrice !== "undefined") filter.price.$gte = Number(minPrice);
      if (typeof maxPrice !== "undefined") filter.price.$lte = Number(maxPrice);
    }

    if (typeof minRating !== "undefined" || typeof maxRating !== "undefined") {
      filter.ratings = {};
      if (typeof minRating !== "undefined")
        filter.ratings.$gte = Number(minRating);
      if (typeof maxRating !== "undefined")
        filter.ratings.$lte = Number(maxRating);
    }

    if (typeof isFreeDelivery !== "undefined") {
      if (isFreeDelivery === "true") filter.isFreeDelivery = true;
      else if (isFreeDelivery === "false") filter.isFreeDelivery = false;
      else {
        return res.status(400).json({
          msg: "Invalid value for isFreeDelivery.Use 'true' or 'false'.",
        });
      }
    }

    const products = await productModel.find(filter);

    if (products.length === 0) {
      return res.status(200).json({ msg: "No Products Match Your Query" });
    }

    return res.status(200).json({
      msg: "Filtered Products",
      count: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Update Product

const updateProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    let data = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid Product Id" });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "No Data Provided for update" });
    }

    const {
      productImage,
      productName,
      category,
      description,
      price,
      ratings,
      isFreeDelivery,
    } = data;

    const updateData = {};

    // Validate Image
    if (productImage) {
      if (!isValid(productImage) || !isValidURL(productImage)) {
        return res.status(400).json({ msg: "Valid Product Image is Required" });
      }
      updateData.productImage = productImage;
    }

    // Validate Name
    if (productName) {
      if (!isValid(productName)) {
        return res.status(400).json({ msg: "Product Name is required" });
      }

      const duplicateProduct = await productModel.findOne({ productName });
      if (duplicateProduct) {
        return res.status(409).json({ msg: "Product Name already exists" });
      }

      updateData.productName = productName;
    }

    // Validate Category
    if (category) {
      if (!isValid(category)) {
        return res.status(400).json({ msg: "Category is Required" });
      }

      let validCategories = [
        "electronics",
        "clothing",
        "food",
        "books",
        "furniture",
      ];
      if (!validCategories.includes(category.trim().toLowerCase())) {
        return res.status(400).json({
          msg: "Category must be 'electronics', 'clothing', 'food', 'books' and 'furniture' ",
        });
      }
      updateData.category = validCategories;
    }

    // Validate Description
    if (description) {
      if (!isValid(description)) {
        return res.status(400).json({ msg: "Description is required" });
      }
      updateData.description = description;
    }

    // Validate Price
    if (price) {
      if (!isValid(price) || price < 0) {
        return res.status(400).json({ msg: "Valid Price is Required" });
      }
      updateData.price = priceNum;
    }

    // Validate Ratings
    if (ratings) {
      if (!isValid(ratings) || ratings < 0 || ratings > 5) {
        return res.status(400).json({ msg: "Valid Rating is Required" });
      }
    }

    // Validate FreeDelivery
    if (typeof isFreeDelivery !== "undefined") {
      if (typeof isFreeDelivery !== "boolean") {
        return res.status(400).json({
          msg: "isFreeDelivery must be a boolean (true or false)",
        });
      }
      updateData.isFreeDelivery = isFreeDelivery;
    }

    const update = await productModel.findByIdAndUpdate(productId, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ msg: "Product Updated Successfully", update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Delete Product

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid Product ID" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product Not Found" });
    }

    await productModel.findByIdAndDelete(productId);
    return res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  getProductsByQuery,
  updateProduct,
  deleteProduct,
};
