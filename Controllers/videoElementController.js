const {VideoElement} = require("../models/models");

class VideoElementController {

    async create(req, res) {
        const {url, blogId} = req.body

        const videoElement = await VideoElement.create({url, blogId})

        return res.status(200).json(videoElement)
    }

    async getAll(req, res) {
        const videoElements = await VideoElement.findAll()

        return res.status(200).json(videoElements)
    }

    async update(req, res) {
        const {id} = req.params
        const {time} = req.body

        const videoElement = await VideoElement.upsert({
            id: id,
            time: time
        })

        return res.status(200).json(videoElement)
    }
}

module.exports = new VideoElementController()