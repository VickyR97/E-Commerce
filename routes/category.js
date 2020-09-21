const express = require("express")
const router =  express.Router()

const {getCategoryId, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category")
const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth")
const { getUserId } = require("../controllers/user")

// PARAMS
router.param("userId", getUserId)
router.param("categoryId", getCategoryId)


// ACTUAL ROUTERS 

// CREATE
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)

// READ
router.get("/category/:categoryId", getCategory)

router.get("/categories", getAllCategory)


// UPDATE
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

//DELETE
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory)


module.exports = router