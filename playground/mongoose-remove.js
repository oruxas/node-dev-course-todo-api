//for ibjectId validation
const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');

// Todo.remove({}).then((res)=>{
//     console.log(res);
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '58ebed423df92a9f6f44b26f'}).then((doc)=>{

});

Todo.findByIdAndRemove('58ebed423df92a9f6f44b26f').then((todo)=>{
    console.log(todo);
});

//NOTES
//in todo.remove cant pass empty arguments
//findOneAndRemove also returns removed data.
//findByIdAndRemove also returns doc