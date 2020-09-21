const express = require("express")
const router = express.Router()
const {isSignedIn, isAuthenticated} = require("../controllers/auth")
const {getToken, processPayment} = require("../controllers/paayment")


router.get("/payment/getToken/:userId", isSignedIn, getToken)

router.post("/payment/braintree/:userId", isSignedIn, processPayment)

module.exports = router;