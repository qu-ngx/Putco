const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");
const Notification = require("../../models/notification");
const User = require("../../models/User");

const getUserProfile = async (req, res) => {
	const { userName } = req.params;

	try {
		const user = await User.findOne({ userName }).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body; // Get the userId from request body or params

		const userToModify = await User.findById(id);
		const currentUser = await User.findById(userId);

		if (id === userId) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
			await User.findByIdAndUpdate(userId, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: userId } });
			await User.findByIdAndUpdate(userId, { $push: { following: id } });
			// Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				from: userId,
				to: userToModify._id,
			});

			await newNotification.save();

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
	  const { userId } = req.body; // Get the userId from the request body
  
	  const currentUser = await User.findById(userId).select("following");
  
	  if (!currentUser) {
		return res.status(404).json({ error: "User not found" });
	  }
  
	  const users = await User.aggregate([
		{
		  $match: {
			_id: { $ne: userId }, // Exclude current user
		  },
		},
		{ $sample: { size: 10 } },
	  ]);
  
	  // Filter out users already followed
	  const filteredUsers = users.filter((user) => !currentUser.following.includes(user._id));
	  const suggestedUsers = filteredUsers.slice(0, 4);
  
	  suggestedUsers.forEach((user) => (user.password = null));
  
	  res.status(200).json(suggestedUsers);
	} catch (error) {
	  console.log("Error in getSuggestedUsers: ", error.message);
	  res.status(500).json({ error: error.message });
	}
  };
  
  

const updateUser = async (req, res) => {
	const { email, userName, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const { userId } = req.body; // Get the userId from the request body

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.email = email || user.email;
		user.userName = userName || user.userName;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

module.exports = { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser };
