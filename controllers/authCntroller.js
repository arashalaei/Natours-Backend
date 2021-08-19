const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

// Sign up
exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, password, passwordConfirm} = req.body;

    const newUser = await User.create({name, email, password, passwordConfirm, role: 'user'})
    
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});

    res.status(201).json({
        status: 'success', 
        token, 
        data:newUser
    })
})