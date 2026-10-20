const {Router} = require('express')
const router = Router()
const VideoElementController = require('../Controllers/videoElementController')

router.get('/', VideoElementController.getAll)
router.post('/', VideoElementController.create)
router.put('/:id', VideoElementController.update)

module.exports = router