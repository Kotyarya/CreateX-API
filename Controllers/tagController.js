const {Tag} = require("../models/models");

class TagController {
    async create(req, res) {
        const {text, branchId} = req.body

        const tag = await Tag.create({text, branchId})

        return res.status(200).json(tag)
    }

    async getAll(req, res) {

        const tags = await Tag.findAll()


        return res.status(200).json(tags)

    }

}

module.exports = new TagController()