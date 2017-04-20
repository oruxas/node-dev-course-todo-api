var {User} = require('./../models/user');

//middleware function, to be moved autise. We get 3 args (req, res, next) actual route doesn't get called until next in middleware
var authenticate = (req,res, next)=>{
    var token = req.header('x-auth');
    //console.log(token);
    User.findByToken(token).then((user)=>{
        //console.log(user);
        if(!user){
            return Promise.reject();
        }

       //console.log(user);
       // res.send(user);
       req.user = user;
       req.token = token;
       next(); //without it routes owont execute
    }).catch((err)=>{
        //401 authentication is required
        res.status(401).send();
    });
};
module.exports = {authenticate};