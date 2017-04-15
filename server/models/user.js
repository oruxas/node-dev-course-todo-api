const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
 email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 1
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

//gonna override method to change how mongoose handles things, ie don't send passord and tokens
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};


//instance methods have acces to individual docs
//arrow funcs do not bind this keyword, but here this stores individual doc
UserSchema.methods.generateAuthToken = function(){
    //instance methods gets called with individual docs
    var user = this;

    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({access, token});

    return user.save().then(()=>{ //this return to allow callinng then in server.js
        return token;
    })
};

//everything we add to sttics turns to model methods where as methods to instances
UserSchema.statics.findByToken = function (token){
    
    var User = this;
    var decoded;

    try{
      decoded =  jwt.verify(token, 'abc123');
      //console.log(decoded);
    } catch (err){
        return Promise.reject();
    }
    
    //success
    return User.findOne({
        //quates here just for consistency
        _id: decoded._id, 
        //to query nested values wrap in quates
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}