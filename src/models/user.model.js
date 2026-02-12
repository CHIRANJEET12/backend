const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required fro creating a user"],
        trim: true,
        lowercase: true,
        unique: [true,"Email already exists"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    name:{
        type: String,
        required: [true, "Name is required for creating an account"],
    },
    password:{
        type: String,
        required: [true, "Pass is required for creating an account"],
        minlength: [6, "Pass should conatin more than 6 characters or ="],
        select: false,
    },
},{
    timestamps: true,
})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        return next()
})


userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user",userSchema)

module.exports = userModel