const ApiError = require("../Error/ApiError");
const {Course, Branch, Curator, WillLearn, Lesson, ForWhomCourse} = require("../models/models");
const {Sequelize, Op} = require("sequelize");

class CourseController {
    async create(req, res, next) {
        try {
            const {title, price, branchId, curatorId, description, date} = req.body
            if (!title || !price || !branchId || !curatorId || !description || !date) {
                return next(ApiError.badRequest("Bad request"))
            }
            const course = await Course.create({title, price, branchId, curatorId, description, date})

            return res.status(200).json(course)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getOneById(req, res) {
        const {id} = req.params
        const course = await Course.findOne(
            {
                where: {id},
                include: [
                    {
                        model: Branch,
                        as: "branch",
                        attributes: ["name"]
                    },
                    {
                        model: Curator,
                        as: "curator",
                    },
                    {
                        model: WillLearn,
                        as: "willLearn",
                        attributes: ["text"],
                    },
                    {
                        model: Lesson,
                        as: "lessons",
                        attributes: ["title", "description"]
                    },
                    {
                        model: ForWhomCourse,
                        as: "forWhom",
                        attributes: ["text"]
                    }
                ],
            }
        )
        return res.status(200).json(course)
    }

    async getAllByBranchId(req, res) {
        let {branchId, page, limit, text} = req.query
        limit = limit || 9
        page = page || 1
        const offset = page * 9 - 9
        text = text || ""

        if (!branchId || branchId === "0") {
            let courses = await Course.findAll(
                {
                    limit, offset, subQuery: false, order: [["id", "ASC"]],
                    include: [{model: Branch, as: "branch", attributes: ["name"]}, {
                        model: Curator,
                        as: "curator",
                    }],
                    where: {
                        "title": {
                            [Op.like]: '%' + text + '%'
                        }
                    },
                }
            )
            return res.status(200).json(courses)
        }

        let courses = await Course.findAll((
            {
                limit, offset, subQuery: false, order: [["id", "ASC"]],
                include: [{model: Branch, as: "branch", attributes: ["name"]}, {
                    model: Curator,
                    as: "curator",
                }],
                where: {
                    branchId,
                    "title": {
                        [Op.like]: '%' + text + '%'
                    }
                }
            }
        ))

        return res.status(200).json(courses)
    }

    async delete(req, res, next) {
        const {id} = req.query

        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const course = await Course.destroy({where: {id}})

        return res.status(200).json(course)
    }
}

module.exports = new CourseController()

// willLearn is associated to course using an alias. You've included an alias (willLearn), but it does not match the alias(es) defined in your association (willLearns).