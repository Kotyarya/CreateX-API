const {Router} = require('express')
const router = Router()
const PodcastElementController = require('../Controllers/podcastElementController')

router.get("/", PodcastElementController.getAll)
router.post("/", PodcastElementController.create)
router.delete("/:id", PodcastElementController.delete)
router.put("/:id", PodcastElementController.update)

module.exports = router