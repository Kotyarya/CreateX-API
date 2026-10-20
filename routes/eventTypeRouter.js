const {Router} = require('express')
const router = Router()
const EventTypeController = require('../Controllers/eventTypeController')

router.post("/", EventTypeController.create)
router.get("/", EventTypeController.getAll)

module.exports = router