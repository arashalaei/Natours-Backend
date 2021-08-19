const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: [true, 'Please tell us your name.'], 
        trim: true
    },
    email:{
        type: String, 
        required: [true, 'Please provide your email.'], 
        validate: [isEmail, 'Please provide a valif email'], 
        trim: true, 
        lowercase: true, 
        unique:true
    }, 
    photo: String, 
    role:{
        type: String,
        enum:['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    }, 
    password: {
        type: String, 
        required: [true, 'Please provide a password'], 
        minLength: [8, 'Password must be more than 10 char\'s'], 
        select: false
    }, 
    passwordConfirm: {
        type: String, 
        required: [true, 'Please provide a password'], 
        validate: {
            validator: function(val){
               return val === this.password
            }, 
            message: 'Passwords are not the same!'
        }
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;