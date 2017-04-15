//json web token gives two funcs, one to create token and one to verify it
const jwt = require('jsonwebToken');

var data = {
    id: 10
}

var token = jwt.sign(data, '123abc');    //takes object with data and signs it: creates hash, returns token val
//token is velue we send back to user when log in, stored in tokens array
console.log(token);
var decoded = jwt.verify(token, '123abc'); //takes token and secret and makes surevasnt validated.
console.log('decoded', decoded);

//NOTES 
//token random string consists of 3 parts: header, payload (we added), verify signature
//header: consist of cryptographic algorithm
//in payload: id we added and iat - issued at timestamp
//verification: where algorithm is executed
//bove info separated by dots.


//OLD EXAMPLES

// const {SHA256} = require("crypto-js");

// var message = 'i am user nr 3';

// var hash = SHA256(message).toString(); //result is object

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
//token will be sent back to user
//hash is hashed value of data
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

//man in the middle :)
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString(); //stores hash of the data prop that comes back

// if(resultHash === token.hash){
//     console.log('Data was not changed')
// } else{
//     console.log('Data was changed don\'t trust');
// }

//not fault proof
//user can change data prop to 5, all they need to do is rehash and add to hash property.
//to prevent this we will salt the hash. Salting - add something unique that changes the value

//hashing string password everytime will provide same result
//everytime using different salt, hash wont be the same