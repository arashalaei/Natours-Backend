const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const {promisify} = require('util');

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

// protect routes
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    console.log(req.headers.authorization);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1]
    if(!token) return next(new AppError('Please first log in then try again', 401));

    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findOne({_id: decode._id});
    if(!currentUser) return next(new AppError('The user belong this token does no longer exist', 401));
    if(currentUser.passwordChangeAfter(decode.iat)) return next(new AppError('User recently changed password! please log in again', 401));

    req.user = currentUser;

    next();
});