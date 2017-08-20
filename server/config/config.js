// if NODE_ENV env is not set, then default to dev env
var env = process.env.NODE_ENV || 'development'; 

console.log('********* env: ', env);

if (env == 'development') {
    process.env.PORT = 3000; // default to port 3000 for running locally.
    process.env.MONGOLAB_URI = 'mongodb://localhost:27017/TodoApp'; // local dev DB
} else if (env == 'test') {
    process.env.PORT = 3000; // default to port 3000 for running locally.
    process.env.MONGOLAB_URI = 'mongodb://localhost:27017/TodoAppTest'; // test DB
} 
