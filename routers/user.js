const express = require("express");
const router = express.Router();
const userController= require("../controllers/user")

router.post('/getDriversById', userController.getDriversById)
router.get('/getDriversByRoute', userController.getDriversByRoute)

module.exports=router