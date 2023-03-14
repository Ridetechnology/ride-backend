const user = require("../models/user");

exports.getDriversByRoute = async (req, res) => {
  try {
    const route = req.query.route;
    const drivers = await user.find({
      userType: "driver",
      route: route,
    });
    if (!drivers) {
      return res.status(404).json({
        message: "Drivers not found",
      });
    } else {
      return res.status(200).json({
        drivers,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.updateDriverRoute = async (req, res) => {
  try {
    const id = req.params.id;
    const route = req.body.route;

    const driver = await user.findById(id);
    if (!driver) return res.status(404).send("Driver not found");

    driver.route = route;
    await driver.save();
    return res.status(200).json({
      message: "Driver Route Updated Successfully",
      driver: driver,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.updateRides = async (req, res) => {
  try {
    const passengerId = req.body.passengerId;
    const driverId = req.body.driverId;

    const driver = await user.findById(driverId);
    if (!driver) return res.status(404).send("Driver not found");

    const passenger = await user.findById(passengerId);
    if (!passenger) return res.status(404).send("Passenger not found");

    driver.rides = driver.rides + 1;
    await driver.save();

    passenger.rides = passenger.rides - 1;
    await passenger.save();

    return res.status(200).json({
      message: "Rides updated successfully",
      passenger: passenger,
      driver: driver,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot Update Rides",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userData = await user.findByIdAndUpdate(id, req.body, { new: true });
    if (!userData) return res.status(404).send("User was not updated");
    return res.status(200).json({
      message: "User updated successfully",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot Update User",
      error: error.message,
    });
  }
};
