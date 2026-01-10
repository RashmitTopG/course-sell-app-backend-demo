const { Router } = require("express");
const { userModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config")
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)


// ADD ZOD later

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    // Find Existing in DB
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log("Error Occured ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
  
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email : email});
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {

      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({
        id : user._id
    }, JWT_USER_PASSWORD)

    return res.status(200).json({
      message: "SignIn Successful",
      token : token
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }

});

userRouter.get("/purchases", (req, res) => {
  res.send("User Purchases Endpoint");
});

module.exports = userRouter;
