const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
}, { _id: false });


const sellerProfileSchema = new mongoose.Schema({
    shopName: { type: String, trim: true },
    gstNumber: String,
    isVerified: { type: Boolean, default: false }
}, { _id: false });


const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid Email"]
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        validate: {
            validator: v => !v || /^[6-9]\d{9}$/.test(v),
            message: "Invalid phone number"
        }
    },
    avatar: String,
    addresses: [addressSchema],
    sellerProfile: {
        type: sellerProfileSchema,
        default: null
    },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false },
    lastLogin: Date
}, { timestamps: true });

//hash password
userSchema.pre("save", async function(next){
    // if(!this.isModified("password")) return next();
    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password,12);
    // next();
});


// userSchema.pre("save", function (next) {
//     if (!this.isModified("password")) return next();

//     bcrypt.hash(this.password, 12)
//         .then(hash => {
//             this.password = hash;
//             next();
//         })
//         .catch(next);
// });

//Hide password
userSchema.methods.toJSON = function(){
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

//compare password

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
}



// userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);