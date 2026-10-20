const {
    Blog,
    ArticleElement,
    VideoElement,
    PodcastElement,
    Tag,
    Branch,
    BlogType,
    ArticleElementList
} = require("../models/models");
const ApiError = require("../Error/ApiError");
const uuid = require("uuid");
const path = require("path");
const {Sequelize, Op} = require("sequelize");
const {te} = require("date-fns/locale");

class BlogController {
    async create(req, res, next) {
        try {

            const {title, branchId, month, day, mainText, firstText, secondText, summary} = req.body

            const blog = await Blog.create({
                title, branchId, month, day, mainText, firstText, secondText, summary
            })
            return res.status(200).json(blog)

        } catch (e) {

        }

    }

    async getAll(req, res, next) {
        let {branchId, blogTypeId, text, page} = req.query

        text = text || ""
        page = page || 1
        const limit = 8
        const offset = limit * page - limit

        if ((!branchId || branchId === "0") && (!blogTypeId || blogTypeId === "0")) {
            console.log(blogTypeId)
            const blogs = await Blog.findAndCountAll({
                limit, offset,
                where: {
                    "title": {
                        [Op.like]: '%' + text + '%'
                    }
                },
                distinct: true,
                include: [
                    {
                        model: BlogType,
                        as: "blogType",
                        attributes: ["name"]
                    },
                    {
                        model: Branch,
                        as: "branch",
                        attributes: ["name"],
                    },
                    {
                        model: ArticleElement,
                        as: "articleElement",
                    },
                    {
                        model: VideoElement,
                        as: "videoElement",
                    },
                    {
                        model: PodcastElement,
                        as: "podcastElement",
                    },

                ]
            })

            return res.status(200).json(blogs)
        }

        if (!branchId || branchId === "0") {
            const blogs = await Blog.findAndCountAll({
                where: {
                    blogTypeId,
                    "title": {
                        [Op.like]: '%' + text + '%'
                    }
                },
                limit, offset,
                include: [
                    {
                        model: BlogType,
                        as: "blogType",
                        attributes: ["name"]
                    },
                    {
                        model: Branch,
                        as: "branch",
                        attributes: ["name"],
                    },
                    {
                        model: VideoElement,
                        as: "videoElement",
                        attributes: ["url", "time"]
                    },
                    {
                        model: PodcastElement,
                        as: "podcastElement",
                        attributes: ["audio", "time"]
                    },
                    {
                        model: ArticleElement,
                        as: "articleElement",
                        attributes: ["article", "text"]
                    }
                ]
            })

            return res.status(200).json(blogs)
        }

        if (!blogTypeId || blogTypeId === "0") {
            const blogs = await Blog.findAndCountAll({
                where: {
                    branchId,
                    "title": {
                        [Op.like]: '%' + text + '%'
                    }
                },
                limit, offset,
                include: [
                    {
                        model: BlogType,
                        as: "blogType",
                        attributes: ["name"]
                    },
                    {
                        model: Branch,
                        as: "branch",
                        attributes: ["name"],
                    },
                    {
                        model: VideoElement,
                        as: "videoElement",
                        attributes: ["url", "time"]
                    },
                    {
                        model: PodcastElement,
                        as: "podcastElement",
                        attributes: ["audio", "time"]
                    },
                    {
                        model: ArticleElement,
                        as: "articleElement",
                        attributes: ["article", "text"]
                    }
                ]
            })
            return res.status(200).json(blogs)
        }

        const blogs = await Blog.findAndCountAll({
            where: {
                branchId,
                blogTypeId,
                "title": {
                    [Op.like]: '%' + text + '%'
                }
            },
            limit, offset,
            include: [
                {
                    model: BlogType,
                    as: "blogType",
                    attributes: ["name"]
                },
                {
                    model: Branch,
                    as: "branch",
                    attributes: ["name"],
                },
                {
                    model: VideoElement,
                    as: "videoElement",
                    attributes: ["url", "time"]
                },
                {
                    model: PodcastElement,
                    as: "podcastElement",
                    attributes: ["audio", "time"]
                },
                {
                    model: ArticleElement,
                    as: "articleElement",
                    attributes: ["article", "text"]
                }
            ]
        })

        return res.status(200).json(blogs)
    }

    async getOne(req, res, next) {

        const {id} = req.params

        const blogs = await Blog.findByPk(id, {
            include: [
                {
                    model: BlogType,
                    as: "blogType",
                    attributes: ["name"]
                },
                {
                    model: Branch,
                    as: "branch",
                    attributes: ["name"],
                    include: [
                        {
                            model: Tag,
                            as: "tags",
                            attributes: ["text"]
                        }
                    ]
                },
                {
                    model: VideoElement,
                    as: "videoElement",
                    attributes: ["url", "time"]
                },
                {
                    model: PodcastElement,
                    as: "podcastElement",
                    attributes: ["audio", "time"]
                },
                {
                    model: ArticleElement,
                    as: "articleElement",
                    attributes: ["article", "text"],
                    include: [
                        {
                            model: ArticleElementList,
                            as: "articleElementList",
                            attributes: ["text"]
                        }
                    ]
                }
            ]
        })

        return res.status(200).json(blogs)

    }

    async delete(req, res) {
        const {id} = req.params

        const blog = await Blog.destroy({where: {id}})


        return res.status(200).json(blog)
    }

    async update(req, res) {
        const {id} = req.params
        const {blogTypeId} = req.body

        const blog = await Blog.upsert(
            {
                id: id,
                blogTypeId: blogTypeId
            }
        )
        return res.status(200).json(blog)

    }
}


module.exports = new BlogController()