var express = require('express');
var bodyParser = require('body-parser');

var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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