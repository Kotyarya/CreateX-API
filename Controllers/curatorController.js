const ApiError = require("../Error/ApiError");
const {Curator} = require("../models/models");
const uuid = require("uuid");
const path = require('path');

class CuratorController {
    async create(req, res, next) {

        try {
            const {name, jobTitle, rate, description, students} = req.body
            const {img} = req.files
            if (!name || !jobTitle || !rate || !description || !students || !img) {
                return next(ApiError.badRequest("Bad request"))
            }

            let fileName = uuid.v4() + ".png"
            await img.mv(path.resolve(__dirname, "..", "static", fileName))

            const curator = await Curator.create({name, jobTitle, rate, description, students, img: fileName})

            return res.status(200).json(curator)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        const {limit} = req.query

        if (!limit) {
            const curators = await Curator.findAll()

            return res.status(200).json(curators)
        }

        const curators = await Curator.findAll({limit})

        return res.status(200).json(curators)
    }

    async getOne(req, res, next) {
        const {id} = req.params

        const curator = await Curator.findOne({where: {id}})

        return res.status(200).json(curator)
    }


    async delete(req, res, next) {

        const {id} = req.query

        if (!id) {
            return next(ApiError.badRequest("ID is not valid"))
        }

        const curator = await Curator.destroy({where: {id}})

        return res.status(200).json(curator)

    }

    async update(req, res, next) {
        const {id} = req.params
        const {text} = req.body

        const curator = await Curator.update({"description": text}, {
            where: {
                id
            }
        })

        return res.status(200).json(curator)


    }
}

module.exports = new CuratorController()