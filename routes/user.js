import { Router } from "express";

const userRouter = Router();

userRouter.post("/signin" ,(req,res)=>{
    res.send("User Signin Endpoint")
})

userRouter.post("/signup" , (req,res)=>{
    res.send("User Signup Endpoint")
})

userRouter.get("/purchases" , (req,res)=>{
    res.send("User Purchases Endpoint")
})

module.exports = {
    userRouter : userRouter
};