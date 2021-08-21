const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

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
    }, 
    passwordChangeAt: Date, 
    passwordResetToken: String, 
    passwordResetExpires: Date
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;

    next();
})

userSchema.methods.comparePassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.passwordChangeAfter = function(JWTTimeStamp){
    if(this.passwordChangeAt)
        return JWTTimeStamp < parseInt(this.passwordChangeAt.getTime() / 1000, 10);

    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minute
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;