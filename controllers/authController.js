const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Create User Controller
const registerController = async (req, res, next) => {

    const { name, email, password } = req.body;
    //validate
    if (!name) {
        next("name is required");
    }
    if (!email) {
        next("email is required");
    }
    if (!password) {
        next("password is required and greater than 6 character");
    }
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
        next("Email Already Register Please Login");
    }
    const user = await userModel.create({ name, email, password });

    // Create Token
    const token = user.createJWT();

    // Password not show in Console
    user.password = undefined;

    res.status(201).send({
        success: true,
        message: "User Created Successfully",
        token,
        user
    })
}

// Login User Controller
const loginUserController = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            next("Please Provide All Fields");
        }

        // compare email
        const user = await userModel.findOne({ email: email })
        if (!user) {
            next("Invalid Username && Password");
        }

        // compare password
        // const isMatch = await bcrypt.compare(password, user.password)
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            next("Invalid Useraname or password");
        }
        const token = await user.createJWT();
        res.status(201).send({
            success: true,
            message: "User Login Successfully",
            token,
            user
        })
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Login API",
            error
        })
    }
}

module.exports = { registerController, loginUserController }