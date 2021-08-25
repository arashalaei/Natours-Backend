const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/APIFeatures');
const AppError = require('./../utils/AppError');

// Get all users
exports.getAllUsers = catchAsync(async(req, res, next) =>{
    const features = new APIFeatures(User.find(), req.query)
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate();
                
    const users = await features.query;

    res.status(200).json({
        status: 'success',
        length: users.length, 
        data: users
    })
})
// Get a user
exports.getUser = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
}
// Create new user
exports.createNewUser = catchAsync(async (req, res, next) =>{
    const {name, email, password, passwordConfirm} = req.body;

    const newUser = await User.create({
                                        name,
                                        email,
                                        password, 
                                        passwordConfirm, 
                                        role: 'user'
                                    })

    res.status(201).json({
        status: 'success',
        data:{
            newUser
        }
    })
})

// Update user
exports.updateUser = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message: 'not defines yet!'
    })
}
// delete user
exports.deleteUser = (req, res) =>{
    res.status(204).json({
        status: 'success',
        message: null
    })
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el]
        }
    })

    return newObj;
}

// Update me
exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) return next(new AppError('This route is not for password updates. Please use /updateMyPassword.',400));
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {new: true, runValidators: true})
    res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        }
    });
})
// Delete me
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });