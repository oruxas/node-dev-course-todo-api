// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //creates variable equal to property with same name of require mongodb , comma allows multiple


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err){
       return console.log('Unable to connect to mongo db server');//preventing the rest of function from executing with return
    }
    console.log('Connected to mongodb server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('58e948ffeaba46a1338d0149')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result)=>{
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('58e933baabfadd3070002b4c')
    }, {
        $set: {
            name: 'Evaldas',          
        },
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });

    //db.close();
});

//findOneAndUpdate - lets update individual doc and also returns updated values
//have too use update operators otherwise won't work