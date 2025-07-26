import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Car from '../models/Car.js'


// helper to generate token
const generateToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Register user
export const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: 'All fields required, password must be at least 8 chars.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id.toString());

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Login user
export const loginuser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials.' });
        }

        const token = generateToken(user._id.toString());

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//get user data through token

export const getUserData = async(req, res) => {
    try{
        const {user} = req;
        res.json({success: true, user});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}

//Get all cars for the frontend 

export const getCars = async(req, res) => {
    try{
        const cars = await Car.find();
        res.json({success: true , cars});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}