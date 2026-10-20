const ApiError = require("../Error/ApiError");
const {ForWhomEvent} = require("../models/models");

class ForWhomEventController {
    async create(req, res, next) {
        const {eventId, text} = req.body

        if (!eventId || !text) {
            return next(ApiError.badRequest("Bad Request"))
        }

        const forWhomEvent = await ForWhomEvent.create({eventId, text})
        return res.status(200).json(forWhomEvent)
    }

    async getAll(req, res) {
        const forWhomEvent = await ForWhomEvent.findAndCountAll()

        return res.status(200).json(forWhomEvent)
    }

    async getForOneEvent(req, res, next) {

        const {id} = req.params

        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const forWhomEvent = await ForWhomEvent.findAll({where: {eventId: id}})
        return res.status(200).json(forWhomEvent)
    }
    
    async delete(req, res, next) {
        const {id} = req.query

        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const forWhomEvent = await ForWhomEvent.destroy({where: {id}})

        return res.status(200).json(forWhomEvent)
    }
}

module.exports = new ForWhomEventController()