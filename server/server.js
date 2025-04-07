const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopLocationsRouter = require("./routes/shop/locations-routes");
const shopUserReviewsRouter = require("./routes/shop/user-reviews-routes");
const userRouter = require("./routes/social-media/user-routes");
const userPostRouter = require("./routes/social-media/user-post-routes");
const notificationRouter = require("./routes/social-media/notification-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

require('dotenv').config();

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();

// Port configuration
const PORT = process.env.PORT || 5300;
const CLIENT_PORT = process.env.CLIENT_PORT || 5173;
const CLIENT_PORT_ALT = process.env.CLIENT_PORT_ALT || 5174;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/locations", shopLocationsRouter);
app.use("/api/shop/reviews", shopUserReviewsRouter);
app.use("/api/social-media/user", userRouter);
app.use("/api/social-media/post", userPostRouter);
app.use("/api/social-media/notification", notificationRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  try {
    console.log('SIGTERM received. Shutting down gracefully...');
    
    // Close server first
    await new Promise((resolve) => {
      server.close(resolve);
    });
    console.log('Server closed');
    
    // Then close MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});
