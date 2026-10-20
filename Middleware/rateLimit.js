const createRateLimit = ({windowMs, max}) => {
    const requests = new Map()

    return (req, res, next) => {
        const now = Date.now()
        const key = req.ip
        const recent = (requests.get(key) || []).filter((timestamp) => now - timestamp < windowMs)
        if (recent.length >= max) {
            res.set('Retry-After', String(Math.ceil(windowMs / 1000)))
            return res.status(429).json({message: 'Too many requests'})
        }
        recent.push(now)
        requests.set(key, recent)
        return next()
    }
}

module.exports = {createRateLimit}
