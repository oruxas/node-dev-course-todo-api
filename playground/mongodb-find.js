// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //creates variable equal to property with same name of require mongodb , comma allows multiple


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err){
       return console.log('Unable to connect to mongo db server');//preventing the rest of function from executing with return
    }
    console.log('Connected to mongodb server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('58e932558580754a1cfc5904')
    // }).toArray().then((docs)=>{
    //     console.log('Todos: ');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to fetch todos', err);
    // });
    
    // db.collection('Todos').find().count().then((count)=>{
    //         console.log(`Todos count: ${count}`);
           
    //     }, (err)=>{
    //         console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({name: "Evaldas"}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=>{
        if(err){
            console.log("unable to find users");
        }
    });

    //db.close();
});

//find returns mongodb cursor - not the docs themselves cuz could be thousand, but pointer to docs.
//toArray returns PROMISE
//arguments in find are known as queries