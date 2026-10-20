const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')
const ApiError = require('../Error/ApiError')

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class UserController {
    async login(req, res, next) {
        const {password, email} = req.body
        if (!EMAIL_REGEXP.test(email || '') || typeof password !== 'string' || password.length < 6) {
            return next(ApiError.badRequest("Invalid email or password"))
        }
        const user = await User.findOne({where: {email}})

        if (!user) {
            return next(ApiError.badRequest("There is no such user"))
        }
        const comparePass = bcrypt.compareSync(password, user.password)

        if (!comparePass) {
            return next(ApiError.badRequest("Incorrect password"))
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role
        }, process.env.RANDOM_KEY, {expiresIn: "24h"})

        return res.json({token})

    }

    async register(req, res, next) {
        let {password, email, name, surname} = req.body

        let role = "USER"

        if (!EMAIL_REGEXP.test(email || '') || typeof password !== 'string' || password.length < 6 || !name || !surname) {
            return next(ApiError.badRequest("Invalid email or password"))
        }

        const candidate = await User.findOne({where: {email}})

        if (candidate) {
            return next(ApiError.badRequest("User has already been created"))
        }

        const hashPass = await bcrypt.hash(password, 4)
        const user = await User.create({email, role, password: hashPass, name, surname})
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role,
            name: user.name,
            surname: user.surname
        }, process.env.RANDOM_KEY, {expiresIn: "24h"})

        return res.json({token})
    }

    async check(req, res, next) {
        const token = jwt.sign({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            surname: req.user.surname,
            role: req.user.role
        }, process.env.RANDOM_KEY, {expiresIn: "24h"})

        return res.json({token})
    }
}

module.exports = new UserController()
