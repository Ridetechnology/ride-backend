require("dotenv").config();

const UserDataSets = require("../models/user");
const Joi = require("joi");
const timeline = require("../utils/timestamp");
const jwt_decode = require("jwt-decode");

const { generateUserJwt } = require("../utils/userJwt");

// validate player schema
const userSchema = Joi.object().keys({
  name: Joi.string().required().min(3),
  phone: Joi.string().required().min(10).max(10),
  email: Joi.string().email({ minDomainSegments: 2 }),
  userType: Joi.string().required(),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

// User registration
exports.signup = async (req, res) => {
  try {
    const user = userSchema.validate(req.body);
    if (user.error) {
      // console.log(player.error.message);
      return res.json({
        error: true,
        status: 400,
        message: user.error.message,
      });
    }

    // Check if the email has been already registered.
    let email = await UserDataSets.findOne({
      email: user.value.email,
    });
    if (email) {
      return res.json({
        error: true,
        message: "This Email is already in use",
      });
    }

    // check if the phone number is already registered
    let phoneNumber = await UserDataSets.findOne({
      phone: user.value.phone,
    });
    if (phoneNumber) {
      return res.json({
        error: true,
        message: "This Phone Number is already in use",
      });
    }

    // encrypt the password and asign it to a variable, then delete the confirmPassword filed and set the asigned variable to the password filed.
    const hash = await UserDataSets.hashPassword(user.value.password);
    delete user.value.confirmPassword;
    user.value.password = hash;

    //Generate unique collusion-resistant id for the player.
    // const id = cuid();
    // user.value.cuid = id;

    // send verification email
    // let code = Math.floor(100000 + Math.random() * 900000);  //Generate random 6 digit code.
    // let expiry = Date.now() + 60 * 1000 * 15;  //Set expiry 15 mins ahead from now
    // const sendCode = await sendEmail(result.value.email, code);
    // if (sendCode.error) {
    //     return res.status(500).json({
    //         error: true,
    //         message: "Couldn't send verification email.",
    //     });
    // }
    // result.value.emailToken = code;
    // result.value.emailTokenExpires = new Date(expiry);

    user.value.isActive = true; // temporary player activation.

    // assign resgistration time
    // let date_time = `${date}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    let date_time = timeline.timestamp();
    user.value.registeredAt = date_time;

    // save the new player details to the db
    const newUser = new UserDataSets(user.value);
    //   newPlayer.otp = OTP;
    await newUser.save();
    return res.status(200).json({
      status: "success",
      newUser: newUser,
      message: `Registration Successful`,
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
      reason: error.message,
    });
  }
};

// player login with email and password
exports.signin = async (req, res) => {
  try {
    const { phone, password, deviceToken } = req.body;
    if (!phone || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }

    //1. Find if any account with that email exists in DB
    const user = await UserDataSets.findOne({ phone: phone });
    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }

    //2. Throw error if account is not activated
    if (!user.isActive) {
      return res.status(400).json({
        error: true,
        message: "You must verify your email to activate your account",
      });
    }
    //3. throw error if account is blocked
    if (user.isBlocked) {
      return res.status(400).json({
        error: true,
        message: "Your Account is blocked!",
      });
    }

    //4. Verify the password is valid
    const isValid = await UserDataSets.comparePasswords(
      password,
      user.password
    );
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    //Generate Access token
    const { error, token } = await generateUserJwt(
      user.phone,
      user.email,
      user._id
    );
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    user.accessToken = token;

    await user.save();

    // success
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken: token, //Send it to the client
      id: user._id,
    });
  } catch (error) {
    console.error("Login-error", error);
    return res.status(500).json({
      error: true,
      message: "Some Thing Went Wrong!",
      reason: error.message,
    });
  }
};

// User logout
exports.signout = async (req, res) => {
  try {
    const bearerToken = req.rawHeaders[1];
    const decode = jwt_decode(bearerToken);
    const id = decode.userId;
    let user = await UserDataSets.findOne({ _id: id });
    user.accessToken = "";
    await user.save();
    return res.status(200).json({ success: true, message: "User Logged out" });
  } catch (error) {
    // console.error("user-logout-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
