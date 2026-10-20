const ApiError = require('../Error/ApiError')
const {Event, EventType, Theme, Curator, ForWhomEvent} = require("../models/models");
const dateFns = require('date-fns')
const Sequelize = require('sequelize')
const {Op} = require("sequelize");

class EventController {
    async create(req, res, next) {
        const {title, eventTypeId, month, day, time, curatorId} = req.body

        if (!title || !eventTypeId || !month || !day || !time || !curatorId) {
            return next(ApiError.badRequest("Bad request"))
        }

        const event = await Event.create({title, eventTypeId, month, day, time, curatorId})

        return res.status(200).json(event)
    }

    async getAll(req, res) {

        let {limit, page, eventTypeId, sortBy, text} = req.query

        text = text || ""
        sortBy = sortBy || "ASC"
        limit = limit || 9
        page = page || 1

        const offset = limit * page - limit

        if (!eventTypeId || eventTypeId === "0") {
            const events = await Event.findAndCountAll(
                {
                    where: {
                        "title": {
                            [Op.like]: '%' + text + '%'
                        }
                    },
                    limit, offset, order: [["date", sortBy]],
                    include: [
                        {model: EventType, as: "eventType", attributes: ["name"]},
                        {model: Theme, as: "theme"}
                    ],
                    distinct: true,
                }
            )

            return res.status(200).json(events)
        }

        const events = await Event.findAndCountAll(
            {
                limit, offset, order: [["date", sortBy]],
                where: {
                    eventTypeId,
                    "title": {
                        [Op.like]: '%' + text + '%'
                    }
                },
                include: [
                    {model: EventType, as: "eventType", attributes: ["name"]},
                    {model: Theme, as: "theme"}
                ],
                distinct: true
            }
        )


        return res.status(200).json(events)
    }

    async getOne(req, res) {
        const {id} = req.params

        const event = await Event.findOne({
            where: {id}, include: [
                {model: EventType, as: "eventType", attributes: ["name"]},
                {model: Theme, as: "theme"},
                {model: Curator, as: "curator"},
                {model: ForWhomEvent, as: "forWhom", attributes: ["text"]}
            ],
        })
        return res.status(200).json(event)
    }

    async update(req, res) {
        const {id} = req.params
        const {date} = req.body


        const event = await Event.update({"date": date}, {where: {id}})
        const eventUpdate = await Event.findOne({where: {id}})

        return res.status(200).json(eventUpdate)
    }
}

module.exports = new EventController()