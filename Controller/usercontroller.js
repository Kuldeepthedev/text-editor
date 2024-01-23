const User = require("../Model/userModel");
require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');   

const generateOTP = () => {
    return Math.floor(Math.random() * 99999).toString();
};

exports.sendOtp = async (req, resp) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (user) {
            return resp.status(409).json("User Already Exists");
        } else {
            const transporter = await nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: 'choudharykuldeep20000@gmail.com',
                    pass: process.env.mail_pass,
                },
            });

            const _otp = generateOTP();
            const info = await transporter.sendMail({
                from: 'choudharykuldeep20000@gmail.com',
                to: email,
                subject: "OTP verification",
                text: _otp,
                html: `<b>Here's your OTP to create an account: ${_otp}</b>`,
            });

            const name = Math.random().toString(36).substring(2, 10);
            const password = Math.random().toString(36).substring(2, 11);
            const user = {
                email: email,
                OTP: _otp,
                name: name,
                password: password,
                avatar: {
                    public_id: "demo_id",
                    url: "demo_url"
                }
            };

            await User.create(user);

            resp.status(200).json(user);
        }
    } catch (error) {
        console.error(error);
        return resp.status(400).json({ error: 'Error' });
    }
};

exports.resendOtp = async (req, resp) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return resp.status(404).json("User not found");
        }

        const _otp = generateOTP();
        user.OTP = _otp;
        await user.save();

        const transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'choudharykuldeep20000@gmail.com',
                pass: process.env.mail_pass,
            },
        });

        const info = await transporter.sendMail({
            from: 'choudharykuldeep20000@gmail.com',
            to: email,
            subject: "Resent OTP",
            text: _otp,
            html: `<b>Here's your resent OTP: ${_otp}</b>`,
        });

        resp.status(200).json(user);
    } catch (error) {
        console.error(error);
        return resp.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.userRegistration = async (req, resp) => {
    const { name, otp, password, email } = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return resp.status(404).json("User not found");
        }

        if (user.OTP !== otp) {
            return resp.status(403).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const currentTime = new Date();
        const otpTime = new Date(user.createdAt);
        const timeDifference = (currentTime - otpTime) / 1000; 

        if (timeDifference > 300) { 
            return resp.status(410).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const result = await User.updateOne({ email: email }, {
            $set: {
                name: name,
                password: hashpassword,
                OTP: ''
            }
        });
        const token = jwt.sign({ userId: user._id }, process.env.secret_key, { expiresIn: '48h' });
        resp.cookie('jwt', token, { httpOnly: true, secure: true },{ domain: 'https://texteditorbykuldeepkumar.netlify.app' });
        const userData = await User.findOne({ email: email });
        return resp.status(200).json({
            success: true,
            message: "User profile created successfully",
            userData,
        });
    } catch (error) {
        console.error(error);
        return resp.status(500).json({
            success: false,
            message: "Error while saving user"
        });
    }
};

exports.userLogin = async (req, resp) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email }).select("+password");

        if (!existingUser) {
            return resp.status(404).json({
                success: false,
                message: "User not registered yet",
            });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return resp.status(403).json({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.secret_key, { expiresIn: '48h' });
        resp.cookie('jwt', token, { httpOnly: true, domain: '.netlify.app' });

        const userData = await User.findOne({ email: email });

        return resp.status(200).json({
            success: true,
            message: "Login success",
            userData
        });
    } catch (error) {
        console.error("Error during login:", error);
        return resp.status(500).json({
            success: false,
            message: "Failed to login. Please try again later.",
        });
    }
};

exports.userLogout = (req, resp) => {
    resp.clearCookie('jwt');
    resp.cookie('jwt', token, { httpOnly: true, domain: '.netlify.app' });

    resp.status(200).json({
        success: true,
        message: 'Logout successful',
    });
};
