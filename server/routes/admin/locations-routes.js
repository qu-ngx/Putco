const express = require("express");
const router = express.Router();
const { fetchNearbyLocations, getLocationDetails } = require("../../controllers/admin/locations-controller");

router.get("/nearby", fetchNearbyLocations);
router.get("/:placeId", getLocationDetails);

module.exports = router; 