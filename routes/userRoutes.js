const router = require('express').Router();
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res
                .status(200)
                .send({ message: "user already exist", success: false })
        }
        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.Password, salt);
        req.body.Password = hashedPassword;
        //created new user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: "User created successfully",
            success: true
        });


    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "user not exits", success: false });
        }
        const validPassword = await bcrypt.compare(req.body.Password, user.Password);
        if (!validPassword) {
            return res.status(200).send({ message: "password is incorrect", success: false });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.send({
            message: "user Login successfully",
            success: true,
            data: token
        });
    } catch (err) {
        res.status(500).send({
            message: err.message,
            data: err,
            success: false
        });
    }
});
router.post('/get-user-info', authMiddleware, async (req, res) => {
    try {
        const user =await User.findOne({ _id: req.body.userId });
        res.send({
            message: "User info successfully fetched",
            success: true,
            data: user
        });
    } catch (error) {
        res.status(404).send({
            message: "User info failed",
            success: false,
            data: error,
        }
        );
    }
}
);
router.post("/change-password", async (req, res) => {
    try {
        const { email, password } = await req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            res.status(200).send({
                message: "user not found",
                success: false
            })
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Update the password
        user.Password = hashedPassword;
        // Save the updated user
        await user.save();
        res.send({
            message: "password Changed successfully",
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
router.post("/send-otp", async (req, res) => {
    try {
        const { expectedOTP, email } = await req.body;
        const userExists = await User.findOne({email: email});
        if (userExists) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "sujitkumardash096@gmail.com",
                    pass: "qpwe nvee bakx rqna",
                },
            });
            // Define the mail options
            
            const mailOptions = {
                from: "Sujit Kumar Dash", // Sender address
                to: email, // List of receivers (comma-separated)
                subject: "Password Restart", // Subject line
                text: `Your otp is ${expectedOTP}`, // Plain text body
            };
            // Send the email using the transporter
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send({
                        message: error.message,
                        data: error,
                        success: false
                    })
                }
                else{
                    res.send({
                        message: "user Otp successfully sent",
                        success: true
                    });
                }
                
            });

        } else {
            return res
                .status(200)
                .send({ message: "user not exist", success: false })
        }

    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }
});

module.exports = router;