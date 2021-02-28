const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add a name']
    },
    email : {
        type : String,
        required : [true, 'Please add an email'],
        unique : [true, 'This email is already registered before'],
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please add a valid email']
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
})


// Sign jwt and return 
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({ id : this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}



// Encrypt password using bcrypt
UserSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next()
})



module.exports = mongoose.model('User', UserSchema);