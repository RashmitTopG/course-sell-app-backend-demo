const express = require("express")
const {courseModel} = require("../db")

const Router = express.Router;

const courseRouter = Router();

courseRouter.get("/purchase" ,(req,res)=>{
    res.send("User Purchased Course Endpoint")
})

courseRouter.get("/bulk" , (req,res)=>{
    res.send("All Courses Endpoint");
})

module.exports = {
    courseRouter : courseRouter
}