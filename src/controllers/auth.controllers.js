const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function userRegisterController(req,res){
    const {email, name, password} = req.body

    const isexist = await userModel.findOne({
        email: email
    })

    if(isexist){
        return res.status(422).json({
            message: "User already exists with eamil",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, name, password
    })

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})

    res.cookies("jwt_token", token)
    res.status(201).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name,
        },
        token,
        message: "Success!!!"
    })
}

module.exports = {
    userRegisterController
}