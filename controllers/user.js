const user = require("../models/user")


exports.getDriversByRoute = async (req, res) => {

    try {
        const drivers = await user.find({
            userType: "driver",
            route: req.query.route
        });
        res.json(drivers);

    } catch (err) {
        res.status(500).json({
            message: 'Error getting drivers by route',
            error: error.message
        });
    }

}

exports.getDriversById = async (req, res) => {

    const passengerId= req.body._id;
    const driverId= req.body._id;



    try {

        const driver = await user.findById(driverId);
        if (!driver) return res.status(404).send("Driver not found");

        const passenger = await user.findById(passengerId);
        if (!passenger) return res.status(404).send("Passenger not found");

        driver.rides = driver.rides + 1;
        await driver.save();

        passenger.rides = passenger.rides - 1;
        await passenger.save();

        res.send("Rides updated successfully");


    } catch (error) {
        res.status(500).json({
            message: 'Cannot Update Rides',
            error: error.message
        });
    }

}

