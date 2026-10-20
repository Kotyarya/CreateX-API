const {Router} = require('express')
const router = Router()
const UserController = require('../Controllers/userController')
const authMiddleware = require('../Middleware/authMiddleware')

router.post("/login", UserController.login)
router.post("/reg", UserController.register)
router.get("/check", authMiddleware, UserController.check)

module.exports = router