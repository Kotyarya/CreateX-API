const ApiError = require("../Error/ApiError");
const {WillLearn} = require("../models/models");

class WillLearnController {
    async create(req, res, next) {
        const {courseId, text} = req.body

        if (!courseId || !text) {
            return next(ApiError.badRequest("Bad Request"))
        }

        const willLearn = await WillLearn.create({courseId, text})
        return res.status(200).json(willLearn)
    }

    async getAll(req, res) {
        const willLearn = await WillLearn.findAll()

        return res.status(200).json(willLearn)
    }

    async getForOneCourse(req, res) {
        const {id} = req.params


        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const willLearn = await WillLearn.findAll({where: {courseId: id}})
        return res.status(200).json(willLearn)
    }


    async delete(req, res, next) {
        const {id} = req.query

        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const willLearn = await WillLearn.destroy({where: {id}})

        return res.status(200).json(willLearn)
    }
}

module.exports = new WillLearnController()