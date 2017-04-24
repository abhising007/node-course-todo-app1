var mongoose = require('mongoose');

mongoose.Promise =  global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');

// process.env.MONGOLAB_URI is mongo database on Abhishek's mongo cloud. If it doesn't exist, connect to local db.
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/TodoApp'); 

module.exports = {
    mongoose
};