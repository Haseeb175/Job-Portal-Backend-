const jwt = require("jsonwebtoken");


const userAuthMiddlerware = async (req, res, next) => {

    try {

        const authheader = req.headers.authorization;
        if (!authheader || !authheader.startsWith("bearer")) {
            next("Authentication Failed");
        }

        const token = authheader.split(" ")[1];
        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            req.user = { userID: payload.userID };
            next();
        } catch (error) {
            next(`Authentication Failed ${error}`)
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in Authentication Failed",
            error
        })
    }
}

module.exports = userAuthMiddlerware;