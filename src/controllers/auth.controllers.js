const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")

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

    res.cookie("jwt_token", token)
    res.status(201).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name,
        },
        token,
        message: "Success!!!"
    })

    await emailService.sendRegistrationEmail(user.email, user.name)
    
}


async function userLogin(req,res){
    const {email, password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
            message: "Email or password is INVALID"
        }) 
    }


    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})

    res.cookie("jwt_token", token)
    res.status(200).json({
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
    userRegisterController,
    userLogin
}