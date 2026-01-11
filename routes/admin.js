const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const { JWT_ADMIN_PASSWORD } = require("../config");

const adminRouter = Router();

/* ======================= SIGNUP ======================= */
adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    return res.status(201).json({
      message: "Admin created successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

/* ======================= SIGNIN ======================= */
adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      JWT_ADMIN_PASSWORD
    );

    return res.status(200).json({
      message: "Signin successful",
      token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

/* ======================= CREATE COURSE ======================= */
adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price } = req.body;

  try {
    const existingCourse = await courseModel.findOne({ title });
    if (existingCourse) {
      return res.status(409).json({
        message: "Course already exists"
      });
    }

    const course = await courseModel.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId
    });

    return res.status(201).json({
      message: "Course created successfully",
      courseId: course._id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

/* ======================= UPDATE COURSE ======================= */
adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { courseId, title, description, imageUrl, price } = req.body;

  try {
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const result = await courseModel.updateOne(
      { _id: courseId, creatorId: adminId },
      { title, description, imageUrl, price }
    );

    if (result.matchedCount === 0) {
      return res.status(403).json({
        message: "You are not allowed to update this course"
      });
    }

    return res.status(200).json({
      message: "Course updated successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

/* ======================= DELETE COURSE ======================= */
adminRouter.delete("/course/:id", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  try {
    const course = await courseModel.findOne({
      _id: req.params.id,
      creatorId: adminId
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found or unauthorized"
      });
    }

    await courseModel.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      message: "Course deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

/* ======================= BULK COURSES ======================= */
adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  try {
    const courses = await courseModel.find({
      creatorId: adminId
    });

    return res.status(200).json({
      courses
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

module.exports = adminRouter;
