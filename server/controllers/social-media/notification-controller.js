const Notification = require("../../models/notification");

const getNotifications = async (req, res) => {
	try {
		// Get the userId from request parameters or body
		const { userId } = req.body; // Assuming userId is passed in the body

		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "userName profileImg",
		});

		// Update all notifications to 'read'
		await Notification.updateMany({ to: userId }, { read: true });

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteNotifications = async (req, res) => {
	try {
		// Get the userId from request parameters or body
		const { userId } = req.body; // Assuming userId is passed in the body

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = { getNotifications, deleteNotifications };
