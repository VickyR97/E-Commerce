const express = require('express')
const router =  express.Router()
const {check, validationResult} = require("express-validator")
const {signout, signup, signin, isSignedIn} = require("../controllers/auth")


router.post("/signup",[
    check("name").isLength({min: 3}).withMessage('Name Should be atleast 3 chars'),
    check("email").isEmail().withMessage('Please enter the valid email address'),
    check("password").isLength({min: 3}).withMessage('Password Should be atleast 3 chars')
],
signup)

router.post("/signin",[
    check("email").isEmail().withMessage('Please enter the valid email address'),
    check("password").isLength({min: 3}).withMessage('Password is required')
],
signin)


router.get("/signout", signout)

router.get("/testroute", isSignedIn, (req, res)=>{
    res.send("A protected route...")
})


module.exports = router;