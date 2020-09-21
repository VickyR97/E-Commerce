require("dotenv").config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// MY ROUTES
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
const paymentRoutes = require("./routes/payment")

// DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("DB CONNECTED")
})


// Middlewares 
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// Routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/api', paymentRoutes)
// Port
const port = process.env.PORT || 8000

// Server Listening
app.listen(port, ()=>{
    console.log(`App is listening on ${port}`)
})