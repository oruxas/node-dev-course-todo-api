const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const{Todo} = require('./../../models/todo');  //.. goes up directory
const{User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email: 'evaldas@example.com',
    password: "userOnePass",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: "clone@example.com",
    password: "userTwoPass",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [{
    _id: new ObjectId(),
    text: "First test todo",
    _creator: userOneId
}, {
     _id: new ObjectId(),
    text: "Second test todo",
    completed: true,
    completedAt: 444,
    _creator: userTwoId
}];



const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos); //return allows to chain callbacks
    }).then(()=> done());
}

const populateUsers = (done)=>{
    User.remove({}).then(()=>{  
        var userOne = new User(users[0]).save(); //save gets promise back
        var userTwo = new User(users[1]).save();

        //promise utility that lets you wait for multiple promises to succeed:
        //Promise.all takes array of promises, callback wont fire until all promises resolved
        return Promise.all([userOne, userTwo]);
    }).then(()=>{
            done();
        });
};
module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}

//notes
//insertMany does not run middleware which is no good cuz cant execute .pre in middleware