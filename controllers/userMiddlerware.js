
// GET user Middleware

const userModel = require("../models/userModel");



// Update User Middleware
const updateUserMiddleware = async (req, res, next) => {

    const { name, email, location } = req.body;
    if (!name || !email || !location) {
        next("Please Provide All Fields");
    }

    const user = await userModel.findOne({ _id: req.user.userID });
    user.name = name;
    user.email = email;
    user.location = location;

    await user.save();
    const token = user.createJWT();
    res.status(201).send({
        success: true,
        message: "User Updated Successfully",
        token,
        user
    })
}

module.exports = { updateUserMiddleware };