const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userModel, courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const { JWT_USER_PASSWORD } = require("../config");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

const userRouter = Router();

/* ========================= SIGNUP ========================= */
userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
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
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ========================= SIGNIN ========================= */
userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);

    return res.status(200).json({
      message: "SignIn Successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ========================= PURCHASED COURSES (MAP APPROACH) ========================= */
userRouter.get("/purchases", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Get all purchases of user
    const purchases = await purchaseModel.find({ userId });

    // 2. Extract courseIds
    const courseIds = purchases.map(p => p.courseId);

    // 3. Fetch full course data
    const courses = await courseModel.find({
      _id: { $in: courseIds }
    });

    return res.status(200).json({
      purchases,
      courses
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

module.exports = userRouter;
