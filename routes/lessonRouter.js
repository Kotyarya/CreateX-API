const {Router} = require('express')
const router = Router()
const LessonController = require('../Controllers/lessonController')

router.post("/", LessonController.create)
router.get("/", LessonController.getAll)
router.get("/:id", LessonController.getForOneCourse)
router.delete("/", LessonController.delete)

module.exports = router