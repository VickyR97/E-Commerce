const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim: true,
        maxlength: 52
    },
    lname:{
        type: String,
        trim: true,
        maxlength: 32
    },
    email:{
        type: String,
        trime: true,
        unique: true,
        required: true
    },
    
    encry_password:{
        type: String,
        required: true
    },
    salt: String,
    role:{
        type: Number,
        default: 0
    },
    purchases:{
        type: Array,
        default: []
    }

    
},{timestamps: true})

userSchema.virtual("password")
    .set(function(password){
        this._password = password;                                      // store actual password
        this.salt = uuidv1();                                           // Generate Salt value
        this.encry_password = this.securePassword(password);            // call function to encrypt the password here
    })
    .get(function(){
        return this._password;
    })

userSchema.methods = {

    autheticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;  
    },


    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256', this.salt)                // encrypt the password here...
            .update(plainpassword)
            .digest('hex');
        }catch (err){
            return "";
        }
    }
}  


module.exports = mongoose.model("User",userSchema)