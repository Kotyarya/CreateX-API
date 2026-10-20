const ApiError = require("../Error/ApiError");
const {ForWhomCourse} = require("../models/models");

class ForWhomCourseController {
    async create(req, res, next) {
        const {courseId, text} = req.body

        if (!courseId || !text) {
            return next(ApiError.badRequest("Bad Request"))
        }

        const forWhomCourse = await ForWhomCourse.create({courseId, text})
        return res.status(200).json(forWhomCourse)
    }

    async getAll(req, res) {
        const forWhomCourse = await ForWhomCourse.findAndCountAll()

        return res.status(200).json(forWhomCourse)
    }

    async getForOneCourse(req, res, next) {
        const {id} = req.params


        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const forWhomCourse = await ForWhomCourse.findAll({where: {courseId: id}})
        return res.status(200).json(forWhomCourse)
    }


    async delete(req, res, next) {
        const {id} = req.query

        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const forWhomCourse = await ForWhomCourse.destroy({where: {id}})

        return res.status(200).json(forWhomCourse)
    }
}

module.exports = new ForWhomCourseController()