const express = require("express");
const router = express.Router();

const updateRoute = require("../controllers/updateRoute");

router.put('/updateDrivers', updateRoute.update)

module.exports=router