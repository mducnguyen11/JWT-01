const express = require("express")
const router = express.Router();
const usersController = require("../controllers/usersController")
const middlewareController = require("../controllers/middlewareController")


router.get("/users",middlewareController.verifyToken, usersController.getAllUsers)
router.delete("/delete/:id",middlewareController.verifyAdminToken, usersController.deleteUser)




module.exports = router;