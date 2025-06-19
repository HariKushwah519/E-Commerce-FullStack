const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const { isValid, isValidRating, isValidNumber } = require("./validator");

// Add Product

const addProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (Object.keys(productData).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });
    }

    const {
      image,
      name,
      category,
      description,
      price,
      ratings,
      isFreeDelivery,
    } = productData;

    // Image Validation

    if (!isValid(image)) {
      return res.status(400).json({ msg: "Image is Required" });
    }

    // Name Validation

    if (!isValid(name)) {
      return res.status(400).json({ msg: "Name is required" });
    }

    let duplicateName = await productModel.findOne({ name });
    if (duplicateName) {
      return res.status(400).json({ msg: "Name Already Exists" });
    }

    // Category Validation

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

    // Description Validation

    if (!isValid(description)) {
      return res.status(400).json({ msg: "Description is required" });
    }

    // Price Validation

    if (!isValidNumber(price)) {
      return res
        .status(400)
        .json({ msg: "Price is required and it must be a Positive Number" });
    }

    // Rating Validation

    if (!isValidRating(ratings)) {
      return res
        .status(400)
        .json({ msg: "Product Rating must be Between 1 and 5" });
    }

    // FreeDelivery Validation

    if (!isValid(isFreeDelivery)) {
      return res.status(400).json({ msg: "Boolean Value is required" });
    }

    const product = await productModel.create(productData);
    return res
      .status(201)
      .json({ msg: "Product Data Addeds Successfully", product });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Product 

const getProducts = async (req, res) => {
  try {
    let productData = await productModel.find();
    return res.status(200).json({ productData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server Error", error });
  }
};

// Get Product  By Id

const getProductById = async (req, res) => {
  try {
    let productId = req.params.id;
    let getProductById = await productModel.findById(productId);
    return res.status(200).json({getProductById});

    if (!getProductById) {
      return res.status(404).json({ msg: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Product By Query





// Update Product

const updateProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    let data = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid Product Id" });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });
    }

    let { image, name, category, description, price, ratings, isFreeDelivery } = data;

    // Validate Image
    if (image !== undefined) {
      if (!isValid(image)) {
        return res.status(400).json({ msg: "Image is Required" });
      }
    }

    // Validate Name
    if (name !== undefined) {
      if (!isValid(name)) {
        return res.status(400).json({ msg: "Name is required" });
      }

      let duplicateName = await productModel.findOne({ name });
        if (duplicateName) {
      return res.status(400).json({ msg: "Name Already Exists" });
      }
    }

    // Validate Category
    if(category !== undefined) {
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
    }

    // Validate Description
    if (description !== undefined) {
      if (!isValid(description)) {
        return res.status(400).json({ msg: "Description is required" });
      }
    }

    // Validate Price
    if (price !== undefined) {
      if (!isValidNumber(price)) {
        return res
          .status(400)
          .json({ msg: "Price is required and it must be a Positive Number" });
      }
    }

    // Validate Ratings
    if (ratings !== undefined) {
      if (!isValidRating(ratings)) {
        return res
          .status(400)
          .json({ msg: "Product Rating must be Between 1 and 5" });
      }
    }

    // Validate FreeDelivery
    if (isFreeDelivery !== undefined) {
      if (!isValid(isFreeDelivery)) {
        return res.status(400).json({ msg: "Boolean Value is required" });
      }
    }

    const update = await productModel.findByIdAndUpdate(
          productId,
          { image, name, category, description, price, ratings, isFreeDelivery },
          { new: true }
        );
    
        if (!update) {
          return res.status(404).json({ msg: "No Product Found" });
        }
        return res
          .status(200)
          .json({ msg: "Product Data Updated Successfully", update });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    };

// Delete Product 

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deleteProductById = await productModel.findByIdAndDelete(productId);
    if (!deleteProductById) {
      return res.status(404).json({ msg: "Product Not Found" });
    }
    return res.status(200).json({ msg: "Product Data Deleted Succesfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
