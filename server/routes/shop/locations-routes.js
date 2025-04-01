const express = require("express");
const {
  getNearbyLocations,
  getLocationDetails,
  searchLocations,
  addToFavorites,
} = require("../../controllers/shop/locations-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Public routes
router.get("/nearby", getNearbyLocations);
router.get("/search", searchLocations);
router.get("/details/:placeId", getLocationDetails);

// Protected routes (require authentication)
router.post("/favorites", authMiddleware, addToFavorites);

module.exports = router; 