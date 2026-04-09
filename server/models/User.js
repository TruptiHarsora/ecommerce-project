const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    fullName:String,
    phone:String,
    addressLine1:String,
    addressLine2:String,
    city:String,
    state:String,
    postalCode:String,
    country:{type:String, default:'India'},
    isDefault:{type:Boolean, default:false}
}, {_id:false});

const userSchema  = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{
        type:String,
        enum:['user', 'admin', 'seller'],
        default:'user'
    },
    phone:String,
    avatar:String,
    addresses:[addressSchema],
    sellerProfile:{
        shopName:String,
        gstNumber:String,
        isVerified:{type:Boolean, default:false},
        
    },
    isVerified:{type:Boolean, default:false},
    lastLogin:Date
},{timestamps:true});

userSchema.index({email:1});

module.exports = mongoose.model("User", userSchema);