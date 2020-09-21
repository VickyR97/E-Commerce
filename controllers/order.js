const {Order, ProductCart} = require("../models//order")

exports.getOrderId = (req, res, next, id) =>{

    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) =>{
        if(err){
            return res.status(400).json({
                error: "NO Order was found"
            })
        }
        req.order = order
        next()
    })
}


exports.createOrder = (req, res) =>{
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err, order) =>{
        if(err){
            return res.status(400).json({
                error: "Failed to create Order"
            })
        }
        res.json(order)
    })

}

exports.getAllOrder = (req,res) =>{
    Order.find()
    .populate("user", "_id name")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "No Orders to be found"
            })
        }
        res.json(order)
    })
}

exports.getOrderStatus = (req, res) =>{
    res.json(Order.schema.path("status").enumValues)
}

// UPDATE ORDER STATUS
exports.updateOrderStatus =(req, res)=>{
    Order.update(
        {_id: req.body.orderId},
        {$set:{status: req.body.status}},
        (err, updateOrder) =>{
            if(err){
                return res.json({
                    error: "Cannot Update Order Status"
                })
            }
            res.json(updateOrder)
        }
    )
}