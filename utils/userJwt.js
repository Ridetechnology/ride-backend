require("dotenv").config();

const jwt = require("jsonwebtoken");

const options = {
  expiresIn: "1h",
};

const secret = process.env.JWT_SECRET;

async function generateUserJwt(username, email, userId) {
  try {
    const payload = {
      username: username,
      email: email,
      userId: userId,
    };
    const token = await jwt.sign(payload, secret, options);
    return { error: false, token: token };
  } catch (error) {
    return { error: true };
  }
}

module.exports = { generateUserJwt };
