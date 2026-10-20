const {ArticleElement} = require("../models/models");

class ArticleElementController {

    async create(req, res) {
        const {article, text, blogId} = req.body

        const articleElement = await ArticleElement.create({article, text, blogId})

        return res.status(200).json(articleElement)
    }

    async getAll(req, res) {
        const articleElements = await ArticleElement.findAll()

        return res.status(200).json(articleElements)
    }

    async delete(req, res) {
        const {id} = req.params

        const articleElement = await ArticleElement.destroy({where: {id}})

        return res.status(200).json(articleElement)
    }
}

module.exports = new ArticleElementController()