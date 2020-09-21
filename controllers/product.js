const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductId = (req, res, next, id) =>{

    Product.findById(id).populate("category").exec((err, product) =>{
        if(err){
            return res.status(400).json({
                error: "NO Product was found"
            })
        }
        req.product = product
        next()
    })
}

exports.getProduct = (req, res) =>{
    req.product.photo = undefined
    return res.json(req.product)
}

//MIDDLE WARE
exports.photo = (req, res, next) =>{
    if(req.product.photo.data){
        res.set("Content-type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}


exports.createProduct = (req, res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }
    
        // DESTRUCTURED THE FIELDS
        const {name, description, price, category, stock} = fields
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all fields"
            })
        }


        let product = new Product(fields)

        // Handle File 
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File is too large!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type

        }

        // Save file to DB
        product.save((err, product) =>{
            if(err){
                return res.status(400).json({
                    error: "Failed to save on DB"
                })
            }
            res.json(product)
        })

    })
}


exports.deleteProduct = (req, res) =>{
    const product = req.product
    product.remove((err, delted) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete"
            })
        }
        res.json({
            message: "Successfully deleted..."
        
        })
    })
}


exports.updateProduct = (req, res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }

        // UPDATION CODE
        let product = req.product
        product = _.extend(product, fields)
        // Handle File 
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File is too large!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type

        }

        // Save file to DB
        product.save((err, product) =>{
            if(err){
                return res.status(400).json({
                    error: "Failed to update on DB"
                })
            }
            res.json(product)
        })

    })
}

// Listing All Products
exports.getAllProduct = (req, res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) =>{
        if(err){
            return res.status(400).json({
                error: "No Product Found"
            })
        }
        res.json(products);
    })
}

exports.getAllUniqueCategories = (req, res)=>{
    Product.distinct("category", {}, (err, category) =>{
        if(err){
            return res.status(400).json({
                error: "No Category Found"
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req, res) =>{
    let myOperations = req.body.order.product.map( prod =>{
        return{
            updateOne:{
                filter: {_id: prod._id},
                update: {$inc:{stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) =>{
        if(err){
            return res.status(400).json({
                error: "Bulk Updation failed"
            })
        }
        next()
    })
}
