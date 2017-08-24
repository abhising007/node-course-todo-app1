// if NODE_ENV env is not set, then default to dev env
var env = process.env.NODE_ENV || 'development'; 
    
console.log('********* env: ', env);

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    // console.log('********* config: ', config);
    var envConfig = config[env];
    // console.log(Object.keys(envConfig));

    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    });
    //  console.log(process.env.PORT);
    //  console.log(process.env.MONGOLAB_URI);
    //  console.log(process.env.JWT_SECRETE);
}

// if (env === 'development') {
//     process.env.PORT = 3000; // default to port 3000 for running locally.
//     process.env.MONGOLAB_URI = 'mongodb://localhost:27017/TodoApp'; // local dev DB
// } else if (env === 'test') {
//     process.env.PORT = 3000; // default to port 3000 for running locally.
//     process.env.MONGOLAB_URI = 'mongodb://localhost:27017/TodoAppTest'; // test DB
// } 
