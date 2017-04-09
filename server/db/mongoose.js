var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //setting up to use promises
mongoose.connect('mongodb://localhost:27017/TodoApp');


module.exports = {
    mongoose
};