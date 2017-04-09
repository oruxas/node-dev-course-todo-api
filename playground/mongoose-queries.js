//for ibjectId validation
const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');

// var id = '58ea38c5effa77144080d715';

// if(!ObjectId.isValid(id)){
//     console.log('Id not valid');
// }


// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos)
// });

// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log('Todo', todo)
// });

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('Id not found');
//     }

//     console.log('Todo by id', todo)
// }).catch((err)=> console.log(err));


var userId = '58e9ed3fa39c259c49ed9e1f';

User.findById(userId).then((user)=>{
    if(!user){
        return console.log('user with Id not found');
    }
    console.log('User: ', user);
}).catch((err)=>done(err));