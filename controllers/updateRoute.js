const user = require("../models/user")

exports.update = async (req, res) => {


  const id = req.params.id;
  const route = req.body;

  try {
    await user.findByIdAndUpdate(id, route);
    return res.send({ message: "Field Updated Successfully!" });


  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
      reason: error.message,
    });

  }

}

