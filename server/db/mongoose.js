var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //setting up to use promises
mongoose.connect(process.env.MONGODB_URI  );


module.exports = {
    mongoose
};