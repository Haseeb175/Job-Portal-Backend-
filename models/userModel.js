const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Require"]
    },
    email: {
        type: String,
        required: [true, "Email is Require"],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, "Password is Require"],
        minLength: [6, "Password Length should be greater than 6 character"]
    },
    location: {
        type: String,
        default: "Pakistan"
    }
}, { timestamps: true }
)
// Hash Password Middleware
userSchema.pre("save", async function () {
    if (!this.isModified) return;
    var salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Json Web Token
userSchema.methods.createJWT = function () {
    return JWT.sign({ userID: this._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
}

// compare password
userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", userSchema);