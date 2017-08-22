const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

// can't use => function as it doesn't bind 'this' keyword needed
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'somescrete').toString();
  
    user.tokens.push({access,token});
    return user.save().then(() => {
        return token;
    })
};

// static method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'somescrete');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth' 
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({'email': email}).then((user) => {
        if (!user){
            console.log("no user found");
            return Promise.reject();
        }

        return new Promise((resolve, reject) =>{
            bcrypt.compare(password, user.password, (err, res) => {
                if (res){
                    resolve(user);
                } else {
                    console.log("password not matching");
                    reject();
                }
            });
        });
    });
};


UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => { // SALT password with 10 number of rounds
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash; // replace the password field with hashed password
                next();
            });
        }); 
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};