const {Router} = require('express')
const router = Router()
const BranchController = require("../Controllers/branchController")

router.post("/", BranchController.create)
router.get("/", BranchController.getAll)
router.delete("/", BranchController.delete)
router.put("/:id", BranchController.update)

module.exports = router