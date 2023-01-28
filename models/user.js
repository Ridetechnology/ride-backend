const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  userType: {
    type: String,
    enum: ["driver", "passenger"],
  },
  vehicleNo: {
    type: String,
  },
  phone: { type: String, unique: true },
  addressLineOne: { type: String },
  addressLineTwo: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  password: { type: String },
  otp: { type: Number },
  referralCode: { type: Number },
  registeredAt: { type: String },
  lastUpdatedAt: { type: String },
  isActive: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  emailToken: { type: String, default: null },
  emailTokenExpires: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  accessToken: { type: String, default: null },
  deviceToken: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed", error);
  }
};

module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    throw new Error("Comparison failed", error);
  }
};
