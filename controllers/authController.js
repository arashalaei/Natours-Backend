const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const {promisify} = require('util');
const sendEmail = require('./../utils/sendEmail');
const crypto = require('crypto');

// Sign token
const signToken = (userId) => jwt.sign({_id: userId}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN})

// create token and send to client

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
        ), 
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    return res.status(statusCode).json({
        status: 'success', 
        token, 
        data: {
            user
        }
    })
}

// Sign up
exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, password, passwordConfirm} = req.body;
    const newUser = await User.create({name, email, password, passwordConfirm, role: 'user'})
    createSendToken(newUser, 201, res);
})

// Sign in
exports.signin = catchAsync(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) return next(new AppError('Please provide bith email & password', 400));
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.comparePassword(password, user.password))) return next(new AppError('Email or password was wrong!', 401));
    createSendToken(user, 200, res);
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

//restric

exports.restrictTo = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) 
        return next(
            new AppError('You do not have permission to perform this action', 403)
        );
        
    next();
}

// forgotpassword

exports.forgotpassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return next(new AppError('There is no user with email address.', 404));
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;
      const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

      try {
        await sendEmail({
            to: user.email, 
            subject: 'Your password reset token (valid for 10 min)', 
            text: message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
      } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        console.log(error);
        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );      
        }
});

// reset password

exports.resetpassword = catchAsync(async(req, res, next) => {
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    console.log(hashToken);
    const user = await User.findOne({passwordResetToken: hashToken, passwordResetExpires:{$gt: Date.now()}})
    if(!user) return next(new AppError('Token is invalid or has expired', 400));
    
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);

})

// Update my password

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');
    const currentPassword = req.body.currentPassword;
    if(!(await user.comparePassword(currentPassword, user.password))) return next(new AppError('Your current password is wrong.', 401));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
})