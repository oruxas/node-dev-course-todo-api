// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //creates variable equal to property with same name of require mongodb , comma allows multiple


MongoClient.connect('mongodb://localhost:27017/TodoAppTests',(err, db)=>{
    if(err){
       return console.log('Unable to connect to mongo db server');//preventing the rest of function from executing with return
    }
    console.log('Connected to mongodb server');

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });
    //deletOne
    // db.collection('Todos').deleteOne({text: "Eat lunch"}).then((result)=>{
    //     console.log(result);
    // });

    //findOneAndDele
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result);
    // });


    db.collection('Users').deleteMany({name: 'Evaldas'}).then((result)=>{
        console.log(result);
    });
    db.collection('Users').findOneAndDelete({_id: new ObjectID('58e93bed895acb3f90752656')}).then((result)=>{
        console.log(result);
    });
    //db.close();
});

//deleteMany lets us target multiple an delete them
//findOneAndDelete - lets remove individual doc and also returns deleted values