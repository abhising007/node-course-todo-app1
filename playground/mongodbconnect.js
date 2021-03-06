const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        console.log('Unable to connect to Mongodb server', error);
        return;
    }
    console.log('Connected to MongoDB server');
    // db.collection('Todos').insertOne({
    //     text:'Something to do',
    //     completed: false
    // }, (error, result)=>{
    //     if(error) {
    //         return console.log('Unable to insert ToDo', error);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('users').insertOne({
        name:'Abs',
        age: 37,
        location: 'Bangalore'
    }, (error, result)=>{
        if(error) {
            return console.log('Unable to insert Users', error);
        }
        // console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());
    });

    db.close();
});