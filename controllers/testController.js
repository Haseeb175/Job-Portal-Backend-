
//Test Controller

const testController = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: "Test API run Successfully"
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: true,
            message: " Error is Test API",
            error
        })
    }
}

module.exports = testController;