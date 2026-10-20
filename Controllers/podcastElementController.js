const uuid = require("uuid");
const path = require("path");
const {PodcastElement, VideoElement} = require("../models/models");

class PodcastElementController {

    async create(req, res) {
        const {blogId} = req.body
        const {podcast} = req.files

        let fileName = uuid.v4() + ".mp3"
        await podcast.mv(path.resolve(__dirname, "..", "static", fileName))

        const podcastElement = await PodcastElement.create({blogId, audio: fileName})

        return res.status(200).json(podcastElement)
    }

    async getAll(req, res) {
        const podcastElements = await PodcastElement.findAll()
        return res.status(200).json(podcastElements)
    }

    async delete(req, res) {
        const {id} = req.params
        const podcastElement = await PodcastElement.destroy({where: {id}})

        return res.status(200).json(podcastElement)
    }

    async update(req, res) {
        const {id} = req.params
        const {time} = req.body

        const podcastElement = await PodcastElement.upsert({
            id: id,
            time: time
        })

        return res.status(200).json(podcastElement)
    }

}

module.exports = new PodcastElementController()