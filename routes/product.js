const express = require("express")
const router = express.Router()

const {getProductId, getProduct, createProduct, photo, deleteProduct, updateProduct, getAllProduct, getAllUniqueCategories} = require("../controllers/product")
const {isAdmin, isSignedIn, isAuthenticated} = require("../controllers/auth")
const {getUserId} = require("../controllers/user")

// Params
router.param("userId", getUserId)
router.param("productId", getProductId)


// Acutual Routes 
// READ
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)


// CREATE 
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)


// DELETE
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

// UPDATE
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

// LISTING ALL
router.get('/products', getAllProduct)

router.get("/product/category", getAllUniqueCategories)

module.exports = router