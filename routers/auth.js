const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const auth = require("../middleware/authentication");

router.post("/signup", authController.signup); // for registration
router.post("/signin", authController.signin); // for login
router.post("/signout", authController.signout); //deleting user access token

module.exports = router;
