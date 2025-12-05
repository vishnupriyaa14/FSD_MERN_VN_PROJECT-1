import { Product, Admin } from "../models/Schema.js"; // Assuming Schema.js exports models

// ================== Fetch Products ==================
export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

// ================== Fetch Product Details ==================
export const fetchProductDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

// ================== Fetch Categories (FIXED: Pulls from Products) ==================
export const fetchCategories = async (req, res) => {
  try {
    // Get all unique categories that actually have products associated with them
    const uniqueCategories = await Product.distinct("category");

    console.log("Fetched Unique Product Categories:", uniqueCategories); // Returns a raw array: ["Mobiles", "Fashion", "Electronics"]

    res.status(200).json(uniqueCategories);
  } catch (err) {
    console.error("fetchCategories Error:", err);
    res.status(500).json({
      message: "Error occurred while fetching categories from products",
      error: err.message,
    });
  }
};

// ================== Add Product (Protected) ==================
export const addNewProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    productMainImg,
    productCarousel,
    productSizes,
    productGender,
    productCategory,
    productNewCategory,
    productPrice,
    productDiscount,
  } = req.body;

  try {
    // 👇 Only authorized user (admin) can add product
    if (req.user.usertype?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    let categoryToUse = productCategory;

    if (productCategory === "new category") {
      // Add new category to Admin model (for manual list/dropdown)
      const admin = await Admin.findOne();
      admin.categories.push(productNewCategory);
      await admin.save();
      categoryToUse = productNewCategory;
    }

    const newProduct = new Product({
      title: productName,
      description: productDescription,
      mainImg: productMainImg,
      carousel: productCarousel,
      category: categoryToUse,
      sizes: productSizes,
      gender: productGender,
      price: productPrice,
      discount: productDiscount,
    });
    await newProduct.save();

    res.json({ message: "Product added!!" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Error occurred" });
  }
};

// ================== Update Product (Protected) ==================
export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const {
    productName,
    productDescription,
    productMainImg,
    productCarousel,
    productSizes,
    productGender,
    productCategory,
    productNewCategory,
    productPrice,
    productDiscount,
  } = req.body;

  try {
    // 👇 Only authorized user (admin) can update product
    if (req.user.usertype !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (productCategory === "new category") {
      const admin = await Admin.findOne();
      admin.categories.push(productNewCategory);
      await admin.save();
      product.category = productNewCategory;
    } else {
      product.category = productCategory;
    }

    product.title = productName;
    product.description = productDescription;
    product.mainImg = productMainImg;
    product.carousel = productCarousel;
    product.sizes = productSizes;
    product.gender = productGender;
    product.price = productPrice;
    product.discount = productDiscount;

    await product.save();

    res.json({ message: "Product updated!!" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

// ================== Buy Product (Placeholder) ==================
export const buyProduct = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      mainImg,
      size,
      quantity,
      price,
      discount,
      paymentMethod,
      orderDate,
      name,
      email,
      mobile,
      address,
      pincode,
    } = req.body; // TODO: Save order to database // Example: await Order.create({ ... })

    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Order failed", error: err.message });
  }
};
