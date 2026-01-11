const express = require("express");
const { purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");

const courseRouter = express.Router();

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const courseId = req.body.courseId;

        if (!courseId) {
            return res.status(400).json({
                message: "courseId is required"
            });
        }

        const bought = await purchaseModel.findOne({
            userId,
            courseId
        });

        if (bought) {
            return res.status(400).json({
                message: "You have already purchased this course"
            });
        }

        await purchaseModel.create({
            userId,
            courseId
        });

        return res.status(200).json({
            message: "Course purchased successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

courseRouter.get("/preview", async (req, res) => {
    const courses = await courseModel.find({});
    return res.status(200).json({ courses });
});

module.exports = {
    courseRouter
};
