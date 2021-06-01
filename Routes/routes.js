const express = require("express");
const routes = express.Router();
const userSchema = require('../models/userSchema');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//routes for registering

routes.post('/register',async (req,res)=>{
  
    var emailExist = await userSchema.findOne({ email:req.body.email})
    if(emailExist){
        res.json("Email already exist");
    }
    else{
    var encryptedPassword = await bcrypt.hash(req.body.password,10);
    const userData = await new userSchema({
        name:req.body.name,
        email:req.body.email,
        password:encryptedPassword
    })
    await userData.save();
    res.json(userData)
}
})

//routes for login 

routes.post('/login',async (req,res)=>{
     var userExist = await userSchema.findOne({email:req.body.email});
     if(!userExist){
         res.json("user not found on this mail, please register")
     }
     else{
         const loginData =await new userSchema({
             email:req.body.name,
             password:req.body.password
         })
         var findPassword = await userSchema.findOne({email:req.body.email})
         var checkPassword = await bcrypt.compare(req.body.password,findPassword.password)
         if(checkPassword){
             var token = await jwt.sign({email:findPassword.email},"authTOken")
             console.log(`you are logged in ${token}`);
             res.header("auth",token).json(token)
         }
     }
})

//function for validating the user

const validatingUser = async (req,res,next)=>{
    var token = await req.header("auth")
    req.token = await token
    next();
}


//routes for all data

routes.get('/',validatingUser,async (req,res)=>{
     jwt.verify(req.token,"authTOken", async (err,data)=>{
         if(err){
             res.sendStatus(403)
            //  RTCIceCandidatePairChangedEvent
         }
         else{
            const userDatas = await userSchema.find();
            res.json(userDatas)
         }
     })
    
})

module.exports = routes;