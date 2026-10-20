const {ArticleElementList} = require("../models/models");

class ArticleElementListController {

    async create(req, res) {
        const {text, articleElementId} = req.body

        const articleElementList = await ArticleElementList.create({text, articleElementId})

        return res.status(200).json(articleElementList)

    }

    async getAll(req, res) {
        const articleElementLists = await ArticleElementList.findAll()

        return res.status(200).json(articleElementLists)
    }

}

module.exports = new ArticleElementListController()