const {Router} = require('express')
const router = Router()
const CourseController = require('../Controllers/courseController')

router.post("/", CourseController.create)
router.get("/:id", CourseController.getOneById)
router.get("/", CourseController.getAllByBranchId)
router.delete("/", CourseController.delete)

module.exports = router