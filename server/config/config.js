var env = process.env.NODE_ENV || 'development';
// console.log('env ***** ', env);


//only test and development environments configured locally, production is configured on heroku or elswwhere
if(env ==="development" || env === "test"){
    //when requiring json file t automatically parses it to a javascript object
    var config = require('./config.json');
    //console.log(config);

    var envConfig = config[env]; //using variable to access property, thus have to use brackets notation.

   Object.keys(envConfig).forEach((key)=>{
    process.env[key] = envConfig[key];
   });
}


// if (env === 'development'){
//     process.env.port = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if (env ==='test' ){
//     process.env.PORT = 30000;
//      process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }