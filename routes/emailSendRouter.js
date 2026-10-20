const {Router} = require('express')
const router = Router()
const EmailSendController = require("../Controllers/emailSendController")


router.post('/sendMessage', EmailSendController.sendMessage)
router.post('/register', EmailSendController.register)
router.post('/subscribe', EmailSendController.subscribe)


module.exports = router