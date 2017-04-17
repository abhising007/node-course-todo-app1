const {MongoClient, ObjectID} = require('mongodb'); // syntax gets the MongoClient and ObjectID properties of mongoDB object

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        console.log('Unable to connect to Mongodb server', error);
        return;
    }

    
    console.log('Connected to MongoDB server');
    db.collection('Todos').find().count().then((count) => {    
        console.log('Todos count ', count);
    }, (error) => {
        console.log('unable to fetch todos', error);
    });

    // db.collection('Todos').find({_id: new ObjectID('58f47fb2c30092ed32353488')}).toArray().then((docs) => {    
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log('unable to fetch todos', error);
    // });
    
    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {    
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log('unable to fetch todos', error);
    // });
    // db.close();
});