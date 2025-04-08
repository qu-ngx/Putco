const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const generateTokenAndSetCookie = require ("../../lib/utils/generateToken.js");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Validate required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: username, email, and password",
      });
    }

    // Check for existing email
    const checkEmail = await User.findOne({ email });
    if (checkEmail)
      return res.status(400).json({
        success: false,
        message: "User already exists with this email! Please try again",
      });

    // Check for existing username
    const checkUsername = await User.findOne({ userName });
    if (checkUsername)
      return res.status(400).json({
        success: false,
        message: "Username is already taken! Please choose a different username",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    res.status(200).json({
    success: true,
    message: "Registration successful",
    });
    //res.status(201).json({
     // _id: newUser._id,
     // userName: newUser.userName,
     // email: newUser.email,
     // followers: newUser.followers,
     // following: newUser.following,
     // profileImg: newUser.profileImg,
     // coverImg: newUser.coverImg,
    //});
  } catch (e) {
    console.log(e);
    // Handle Mongoose validation errors
    if (e.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields correctly",
        errors: Object.values(e.errors).map(err => err.message)
      });
    }
    // Handle other errors
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getMe, authMiddleware };
