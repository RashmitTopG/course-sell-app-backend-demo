const {Router} = require("express")
const {adminModel} = require("../db")

const adminRouter = Router();

adminRouter.post("/signin" , (req,res)=>{
    res.send("Admin Signin Endpoint");
})

adminRouter.post("/siginup" , (req,res)=>{
    res.send("Admin Router Signup Endpoint");
})

// adminRouter.use(adminMiddleware);

// Course
adminRouter.post("/" , (req,res)=>{
    res.send("Admin Router Course Endpoint");
})

// Course
adminRouter.put("/" , (req,res)=>{
    res.send("Admin Router Course Endpoint");
})

adminRouter.get("/course/bulk" , (req,res)=>{
    res.send("Admin Router Course Endpoint");
})


module.exports = adminRouter