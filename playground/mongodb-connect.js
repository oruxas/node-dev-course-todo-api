// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //creates variable equal to property with same name of require mongodb , comma allows multiple

// var obj = new ObjectID();
// console.log(obj);
//ES6
//object destructuring - lets you pull out properties from object into variables
// var user = {name: 'Evaldas', age: 22};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err){
       return console.log('Unable to connect to mongo db server');//preventing the rest of function from executing with return
    }
    console.log('Connected to mongodb server');

    // db.collection('Todos').insertOne({
    //         text: 'first todo',
    //         completed: false
    //     }, (err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert todo ', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2)); 
    // });

    // db.collection('Users').insertOne({
    //     name: 'Evaldas',
    //     age: 22,
    //     location: 'Vilnius'
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('unable to insert user ',err);
    //     }

    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    db.close();
});

//mongo does not create db until you  start adding data to it but you don't need to explicitly create db, 
//writing name here: 'mongodb://localhost:27017/DatabaseName' is enough, 
//same goes for collections: db.collection('CollectionName')

//insertOne takes 2 args: first the object with k-v we want to have, second callback fired when failed or succeeded
//result.ops -- prints all inserted documents

//_id
//for easy scaling out db
//12byte 
//first 4 time stamp refers to moment in time id was created
//next 3 bytes machine identifier (if 2 machines ge)
//next 2 bytes process id
//3 byte counter