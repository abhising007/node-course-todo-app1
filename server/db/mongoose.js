var mongoose = require('mongoose');

mongoose.Promise =  global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');

// process.env.MONGOLAB_URI is mongo database on Abhishek's mongo cloud. 
mongoose.connect(process.env.MONGOLAB_URI); 

module.exports = {
    mongoose
};