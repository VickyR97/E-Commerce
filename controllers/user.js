const User = require('../models/user')
const Order = require("../models/order")

exports.getUserId = (req, res, next, id) =>{
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User was not found"
                
            })
        }
        req.profile = user
        next()

    })
}

exports.getUser = (req, res) =>{
    req.profile.salt = undefined;
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined

    return res.json(req.profile)
}


exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: true},
        (err, user) =>{
            if(err){
                return res.status(400).json({
                    error: "Unable to update"
                })
            }
        user.salt = undefined;
        user.encry_password = undefined
        user.createdAt = undefined
        user.updatedAt = undefined
        res.json(user)
        }
    )
}


exports.getOrders = (req, res) =>{
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) =>{
        if(err){
            return res.status(400).json({
                error: "No Orders"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = []
    req.body.order.products.array.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });

    // STORE THIS INTO DB
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) =>{
            if(err){
                return res.status.json({
                    error: "Unable to save purchases"
                })
            }
            next()
        }
    )
    
    
}


// GET ALL USERS
// exports.getAllUser = (req,res) =>{
//     User.find((err, user) =>{
//         if(err || !user){
//             return res.status(400).json({
//                 error: "User was not found" 
//             })

//         }
//         return res.json(user)
//     })

    
// }