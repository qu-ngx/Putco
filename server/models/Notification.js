const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		type: {
			type: String,
			required: true,
			enum: ["follow", "like"],
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);