const ApiError = require("../Error/ApiError");
const {Lesson} = require("../models/models");

class LessonController {
    async create(req, res, next) {
        const {courseId, title, description} = req.body

        if (!courseId || !title || !description) {
            return next(ApiError.badRequest("Bad Request"))
        }

        const lesson = await Lesson.create({courseId, title, description})
        return res.status(200).json(lesson)
    }

    async getAll(req, res) {
        const lesson = await Lesson.findAndCountAll()

        return res.status(200).json(lesson)
    }

    async getForOneCourse(req, res, next) {
        const {id} = req.params


        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const lesson = await Lesson.findAll({where: {courseId: id}})
        return res.status(200).json(lesson)
    }


    async delete(req, res, next) {
        const {id} = req.query

        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const lesson = await Lesson.destroy({where: {id}})

        return res.status(200).json(lesson)
    }
}

module.exports = new LessonController()