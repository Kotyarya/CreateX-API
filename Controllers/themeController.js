const ApiError = require("../Error/ApiError");
const {Theme} = require("../models/models");

class ThemeController {
    async create(req, res, next) {
        const {title, description, eventId} = req.body

        if (!title || !description || !eventId) {
            return next(ApiError.badRequest("Bad request"))
        }

        const theme = await Theme.create({title, description, eventId})

        return res.status(200).json(theme)

    }

    async getAll(req, res) {

        const themes = await Theme.findAll()

        return res.status(200).json(themes)
    }

    async getByEventId(req, res, next) {
        const {id} = req.params

        if (!id) {
            return next(ApiError.badRequest("ID is invalid"))
        }

        const themes = await Theme.findAndCountAll({where: {eventId: id}})

        return res.status(200).json(themes)

    }
}

module.exports = new ThemeController()