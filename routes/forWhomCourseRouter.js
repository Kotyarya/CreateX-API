const {Router} = require('express')
const router = Router()
const ForWhomController = require('../Controllers/forWhomCourseController')

router.post("/", ForWhomController.create)
router.get("/", ForWhomController.getAll)
router.get("/:id", ForWhomController.getForOneCourse)
router.delete("/", ForWhomController.delete)

module.exports = router