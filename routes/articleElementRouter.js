const {Router} = require('express')
const router = Router()
const ArticleElementController = require('../Controllers/articleElementController')

router.get("/", ArticleElementController.getAll)
router.post("/", ArticleElementController.create)
router.delete("/:id", ArticleElementController.delete)

module.exports = router