const {Router} = require('express')
const router = Router()
const BlogController = require('../Controllers/blogController')

router.post('/', BlogController.create)
router.get('/', BlogController.getAll)
router.get('/:id', BlogController.getOne)
router.put('/:id', BlogController.update)
router.delete('/:id', BlogController.delete)

module.exports = router