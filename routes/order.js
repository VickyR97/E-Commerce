const express = require("express")
const router = express.Router()


const {isAdmin, isSignedIn, isAuthenticated} = require("../controllers/auth")
const {updateStock} = require("../controllers/product")
const {getUserId, pushOrderInPurchaseList} = require("../controllers/user")

const {getOrderId, createOrder, getAllOrder, getOrderStatus, updateOrderStatus} = require("../controllers/order")

// PARAMS
router.param("userId", getUserId)
router.param("orderId", getOrderId)

// CREATE
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)

// READ
router.get("/order/all/:user", isSignedIn, isAuthenticated, isAdmin, getAllOrder)
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)

// UPDATE STATUS
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateOrderStatus)

module.exports = router