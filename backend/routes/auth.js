const express = require("express")
const authController = require('../controllers/authController')
const router = express.Router();
const middlewareController = require("../controllers/middlewareController")


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh', authController.requestRefreshToken)
router.post('/logout', middlewareController.verifyToken , authController.logout)

module.exports = router
