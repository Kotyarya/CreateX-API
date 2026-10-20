const {BlogType} = require("../models/models");

class BlogTypeController {

    async create(req, res) {
        const {name} = req.body

        const blogType = await BlogType.create({name})
        return res.status(200).json(blogType)
    }

    async getAll(req, res) {
        const blogTypes = await BlogType.findAll()

        return res.status(200).json(blogTypes)
    }

}

module.exports = new BlogTypeController()