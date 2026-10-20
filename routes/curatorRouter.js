const Router = require('express')
const CuratorController = require("../Controllers/curatorController")
const router = new Router()

router.post("/", CuratorController.create)
router.get("/", CuratorController.getAll)
router.get("/:id", CuratorController.getOne)
router.delete("/", CuratorController.delete)
router.put("/:id", CuratorController.update)

module.exports = router