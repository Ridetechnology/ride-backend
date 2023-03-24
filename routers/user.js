const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/authentication");

router.put("/updateRides", userController.updateRides);
router.get("/getDriversByRoute", userController.getDriversByRoute);
router.put("/updateDriverRoute/:id", userController.updateDriverRoute);
router.put("/updateUser/:id", userController.updateUser);
router.get("/getUserById/:id", userController.getUserById);

module.exports = router;
