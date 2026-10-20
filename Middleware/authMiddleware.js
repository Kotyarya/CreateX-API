const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next()
    }
    try {
        const [scheme, token] = (req.headers.authorization || '').split(' ')
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({message: "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.RANDOM_KEY)
        req.user = decoded
        next()
    } catch {
        return res.status(401).json({message: "Unauthorized"})
    }
}
