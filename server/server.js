var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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


app.listen(3000, ()=>{
    console.log('Listening on port 3000');
})


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