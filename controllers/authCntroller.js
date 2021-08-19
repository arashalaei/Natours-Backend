const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');

// Sign token
const signToken = (userId) => jwt.sign({_id: userId}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN})

// Sign up
exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, password, passwordConfirm} = req.body;

    const newUser = await User.create({name, email, password, passwordConfirm, role: 'user'})
    
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success', 
        token, 
        data:newUser
    })
})

// Sign in
exports.signin = catchAsync(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) return next(new AppError('Please provide bith email & password', 400));

    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.comparePassword(password, user.password))) return next(new AppError('Email or password was wrong!', 401));

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success', 
        token
    })

})