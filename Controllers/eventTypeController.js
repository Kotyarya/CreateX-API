const ApiError = require("../Error/ApiError");
const {EventType} = require("../models/models");

class EventTypeController {
    async create(req, res) {
        const {name} = req.body
        if (!name) {
            return next(ApiError.badRequest("Name is not valid"))
        }

        const eventType = await EventType.create({name})
        return res.status(200).json(eventType)
    }

    async getAll(req, res) {
        const eventTypes = await EventType.findAll()
        return res.status(200).json(eventTypes)
    }
}

module.exports = new EventTypeController()