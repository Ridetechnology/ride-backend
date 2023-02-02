const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/authentication");

router.put(
  "/updateRides",
  auth.verifyTokenAndAuthorization,
  userController.updateRides
);
router.get(
  "/getDriversByRoute",
  auth.verifyTokenAndAuthorization,
  userController.getDriversByRoute
);
router.put(
  "/updateDriverRoute/:id",
  auth.verifyTokenAndAuthorization,
  userController.updateDriverRoute
);

module.exports = router;
