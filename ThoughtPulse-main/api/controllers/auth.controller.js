import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Helper: Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Signup Controller
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, "All fields are required"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(errorHandler(400, "Invalid email format"));
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
        return next(errorHandler(400, "Invalid username"));
    }

    try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return next(errorHandler(400, "Username already exists"));
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return next(errorHandler(400, "Email already exists"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Optionally, auto-login after signup
        const token = generateToken(newUser);
        const { password: pass, ...userData } = newUser._doc;

        return res.status(201).cookie('access_token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json({ message: 'Signup successful!', user: userData });
    } catch (err) {
        next(err);
    }
};

// Signin Controller
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email.trim() === '' || password.trim() === '') {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User Not found'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Invalid Password'));
        }

        const token = generateToken(validUser);
        const { password: pass, ...others } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json(others);
    } catch (err) {
        next(err);
    }
};

// Google Auth Controller
export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            const token = generateToken(user);
            const { password, ...rest } = user._doc;
            return res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,