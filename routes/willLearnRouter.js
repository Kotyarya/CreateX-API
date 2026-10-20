const {Router} = require('express')
const router = Router()
const WillLearnController = require("../Controllers/willLearnController")

router.post("/", WillLearnController.create)
router.get("/", WillLearnController.getAll)
router.get("/:id", WillLearnController.getForOneCourse)
router.delete("/", WillLearnController.delete)

module.exports = router