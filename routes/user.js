const express = require("express")
const router = express.Router()

const{getUserId, getUser, getAllUser, updateUser, getOrders} = require("../controllers/user")
const{isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")




router.param("userId", getUserId)

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)


router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)


router.get("orders/user/:userId", isSignedIn, isAuthenticated, getOrders)





// GET ALL USERS ROUTE
// router.get("/user", getAllUser)

module.exports = router