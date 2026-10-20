const ApiError = require("../Error/ApiError")

module.exports = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    const status = Number.isInteger(err.status) ? err.status : 500
    const message = status < 500 ? 'Request rejected' : 'Unknown error'
    return res.status(status).json({message})
}
