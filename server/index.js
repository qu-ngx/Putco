const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth/auth-routes");
const adminProductsRoutes = require("./routes/admin/products-routes");
const adminOrderRoutes = require("./routes/admin/order-routes");
const shopProductsRoutes = require("./routes/shop/products-routes");
const shopCartRoutes = require("./routes/shop/cart-routes");
const shopAddressRoutes = require("./routes/shop/address-routes");
const shopOrderRoutes = require("./routes/shop/order-routes");
const shopSearchRoutes = require("./routes/shop/search-routes");
const shopReviewRoutes = require("./routes/shop/review-routes");
const commonFeatureRoutes = require("./routes/common/feature-routes");
const locationsRoutes = require("./routes/shop/locations-routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/shop/products", shopProductsRoutes);
app.use("/api/shop/cart", shopCartRoutes);
app.use("/api/shop/address", shopAddressRoutes);
app.use("/api/shop/order", shopOrderRoutes);
app.use("/api/shop/products/search", shopSearchRoutes);
app.use("/api/shop/review", shopReviewRoutes);
app.use("/api/common/feature", commonFeatureRoutes);
app.use("/api/shop/locations", locationsRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const PORT = process.env.PORT || 5300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 