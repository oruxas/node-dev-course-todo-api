require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;// || 3000 set with environment; 

app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
    console.log(req.body); //body gets stored by body parser

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (err) =>{
        res.status(400).send(err);
    });

});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (err)=>{
        res.status(400).send(err);
    });
});

//var id = '58ea38c5effa77144080d715';

app.get('/todos/:id',(req,res)=>{
   // req.params.id    
   var id = req.params.id;

   if(!ObjectId.isValid(id)){
    //if ot valid
    return res.status(404).send();
   }

   Todo.findById(id).then((todo)=>{
    if(!todo){
        return res.status(404).send();
    }

    res.send({todo});
   }).catch((err)=> {
       res.status(400).send();
   });
});

app.delete('/todos/:id', (req, res)=>{
    var id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    });
});

app.patch('/todos/:id',(req, res)=>{
    var id = req.params.id;
    //so  that user wouldn't be able to update whatever 
    var body = _.pick(req.body, ['text', 'completed']);   //pass req.body and takes array of properties if exist
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();    //num of secs since 1997 jan 1, greater than 0 values forward, less than 0 in the past
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body}, {new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    });
});

app.post('/users', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(()=>{
       return user.generateAuthToken(); //return because expecting chainign promises
       
       // res.send(user);
    }).then((token)=>{
        res.header('x-auth', token).send(user); //x- means it's custom header
    }).catch((err)=>{
        res.status(400).send(err);
    }); 
});

//referencing middleware
app.get('/users/me', authenticate, (req, res)=>{
   res.send(req.user);
});

//route for logging users
//POST /users/login {email, password}
app.post('/users/login', (req, res)=>{
     var body = _.pick(req.body, ['email', 'password']);

     User.findByCredentials(body.email, body.password).then((user)=>{
         //no need to check if user exist cuz already done in findByCredentials if true, catch would run
        //res.send(user);
        return user.generateAuthToken().then((token)=>{
            //return to keep chain alive, cuz if errors here, catch will catch em
            res.header('x-auth', token).send(user);
        });
     }).catch((err)=>{
         res.status(400).send();
     });

     //res.send(body);
});


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

module.exports = {
    app
};


//========= OLD EXAMPLES ==========
// var newTodo = new Todo({
//     text: "Go to sleep",
//     completed: true,
//     completedAt: new Date().getMinutes()
// });

// newTodo.save().then((doc)=>{
//     console.log('Saved todo: ',doc)
// }, (err)=>{
//     console.log('unable to save');
// });



// var user = new User({
//     email: 'evaldas@example.com     '
// });

// user.save().then((doc)=>{
//     console.log('User saved: ', doc);
// }, (err)=>{
//     console.log('Unable to save user: ',err);
// })


//NOTES
//behind scenes waits for connection before ever trying to make query
//body parser lets send json to server

//delete by id success gets called even if no docs are deleted