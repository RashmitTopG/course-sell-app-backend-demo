import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());

const {userRouter , courseRouter} = require("./routes")

app.get("/" , (req,res)=>{
    res.json({
        message : "Hello World"
    })
})

app.use("/user" , userRouter);
app.use("/course" , courseRouter);

app.post("/course/purchase" , (req,res)=>{
    res.json("Course Purchase Endpoint")
})

app.get("/course/bulk" , (req,res)=>{
    res.json("Get All Purchases")
})

app.listen(PORT , ()=>{
    console.log(`Server is Running on PORT ${PORT}` )
})