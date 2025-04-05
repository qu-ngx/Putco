const express = require ("express");
const { protectRoute } = require ("../middleware/protectRoute.js");
const { deleteNotifications, getNotifications } = require("../controllers/notification-controller.js");

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);

module.exports = router;
