const express = require ("express");
const { protectRoute } = require ("../middleware/protectRoute.js");
const { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } = require ("../controllers/social-media/user-controller.js");

const router = express.Router();

router.get("/profile/:userName", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

module.exports = router;