const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const Report = require('../models/reportModel');
const Exam = require('../models/examModel');
const User = require('../models/userModel');
router.post('/add-reports', authMiddleware, async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.send({
            message: "Successfully added attempt",
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});
router.post('/get-all-reports', authMiddleware, async (req, res) => {
    try {
        const { examName, userName } = req.body;
        const exams = await Exam.find({
            name: {
                $regex: examName,
            },
        });
        const matchedExamIds = exams.map((exam) => exam._id);
        const users = await User.find({
            name: {
                $regex: userName,
            },
        });
        const matchedUserIds = users.map((user) => user._id);
        const report = await Report.find(
            {
                exam: {
                    $in: matchedExamIds
                },
                user: {
                    $in: matchedUserIds
                }
            }

        ).populate("exam").populate("user").sort({ createdAt: -1 });
        res.send({
            message: "Attempt fetched successfully",
            data: report,
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});
router.post('/get-all-reports-by-user', authMiddleware, async (req, res) => {
    try {
        const report = await Report.find({ user: req.body.userId }).populate("exam").populate("user").sort({ createdAt: - 1 });
        res.send({
            message: "Attempt fetched successfully",
            data: report,
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});



module.exports = router;