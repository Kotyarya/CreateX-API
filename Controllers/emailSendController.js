const ApiError = require('../Error/ApiError')
const {FormSubmission} = require('../models/models')

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const requests = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5

const clean = (value, maxLength) => typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : ''

const isRateLimited = (req) => {
    const now = Date.now()
    const key = `${req.ip}:${req.path}`
    const recent = (requests.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS)
    recent.push(now)
    requests.set(key, recent)
    return recent.length > MAX_REQUESTS
}

const sourceFrom = (req) => clean(req.get('referer'), 2048) || null

const saveSubmission = (req, values) => FormSubmission.create({
    ...values,
    source: sourceFrom(req),
})

class EmailSendController {
    async subscribe(req, res, next) {
        try {
            const email = clean(req.body.email, 254).toLowerCase()
            if (!EMAIL_REGEXP.test(email)) return next(ApiError.badRequest('Invalid email'))
            if (isRateLimited(req)) return res.status(429).json({message: 'Too many requests'})
            await saveSubmission(req, {type: 'subscription', email})
            return res.status(200).json({message: 'Subscription saved'})
        } catch (error) {
            return next(new ApiError(503, 'Could not save your request'))
        }
    }

    async sendMessage(req, res, next) {
        try {
            const email = clean(req.body.email, 254).toLowerCase()
            const name = clean(req.body.name, 160)
            const message = clean(req.body.message, 5000)
            const phone = clean(req.body.phone, 64)
            if (!EMAIL_REGEXP.test(email) || !name || !message) return next(ApiError.badRequest('Invalid form data'))
            if (isRateLimited(req)) return res.status(429).json({message: 'Too many requests'})
            await saveSubmission(req, {type: 'contact', email, name, message, phone: phone || null})
            return res.status(200).json({message: 'Message saved'})
        } catch (error) {
            return next(new ApiError(503, 'Could not save your request'))
        }
    }

    async register(req, res, next) {
        try {
            const email = clean(req.body.email, 254).toLowerCase()
            const name = clean(req.body.name, 160)
            const phone = clean(req.body.phone, 64)
            if (!EMAIL_REGEXP.test(email) || !name || !phone) return next(ApiError.badRequest('Invalid form data'))
            if (isRateLimited(req)) return res.status(429).json({message: 'Too many requests'})
            await saveSubmission(req, {type: 'registration', email, name, phone})
            return res.status(200).json({message: 'Registration saved'})
        } catch (error) {
            return next(new ApiError(503, 'Could not save your request'))
        }
    }
}

module.exports = new EmailSendController()
