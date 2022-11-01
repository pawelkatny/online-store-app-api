const { StatusCodes } = require('http-status-codes');

const dashboard = async (req, res) => {
    res.status(200).json({ user: req.user });
}

module.exports = {
    dashboard
}