const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const  bcrypt = require('bcryptjs');

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
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
    user.tokens.push({access, token});

    return user.save().then(()=>{ //this return to allow callinng then in server.js
        return token;
    })
};

UserSchema.methods.removeToken = function(token){
    //$pull let remove tems from array that match certain criteria
    var user = this;
    return user.update({
        $pull:{
            //pull from tokens array token that match  token from parameter, if match removes entire object
            tokens: {
                token: token
            }
        }
    });
};

//everything we add to sttics turns to model methods where as methods to instances
UserSchema.statics.findByToken = function (token){
    
    var User = this;
    var decoded;

    try{
      decoded =  jwt.verify(token, process.env.JWT_SECRET);
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
};//end find by token

UserSchema.statics.findByCredentials = function(email, password){
    //var user = this;
   var User = this;

   //return for chaining
   return User.findOne({email}).then((user)=>{
       if(!user){
           //rejected promise automatically calls catch in server.js
        return Promise.reject();
       }

       //bcrypt methods does not support promises, but callbacks only
       return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err, res)=>{
                if (res){
                    resolve(user);
                } else{
                    reject();
                }
            })
       });
   });
};

UserSchema.pre('save', function (next){
    var user = this;
    //console.log('something');
    //true if pasword modified
   if( user.isModified('password')) {
       //console.log('inside');
        bcrypt.genSalt(10, (err, salt)=>{
            //console.log('me');
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next(); //completes middleware
            });
        });
   }   else{
       next();
   }   
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}