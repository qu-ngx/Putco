const express = require ("express");
const protectRoute  = require ("../../middleware/protectRoute.js")
const {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost
} = require ("../../controllers/social-media/user-post-controller.js");

const router = express.Router();

router.get("/all", getAllPosts);
router.get("/following", getFollowingPosts);
router.get("/likes/:id", getLikedPosts);
router.get("/user/:userName",  getUserPosts);
router.post("/create", createPost);
router.post("/like/:id", likeUnlikePost);
router.post("/comment/:id", commentOnPost);
router.delete("/:id", deletePost);

module.exports = router;