const {MongoClient, ObjectID} = require('mongodb'); // syntax gets the MongoClient and ObjectID properties of mongoDB object

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        console.log('Unable to connect to Mongodb server', error);
        return;
    }

    
    console.log('Connected to MongoDB server');
    db.collection('Todos').findOneAndUpdate({
        _id:new ObjectID('58f48a1ec30092ed3235372d')
    },
    {
        $set : {
            completed: true
        }
    }, 
    {
        returnOriginal: false
    }).then((result) => {    
        console.log('Result ', result);
    });


    db.collection('users').findOneAndUpdate({
        _id:new ObjectID('5991bc1df0283736ace07026')
    },
    {
        $set : {
            name: 'Abhishek'
        },
        $inc: {
            age: 1
        }
    }, 
    {
        returnOriginal: false
    }).then((result) => {    
        console.log('Result ', result);
    });

     db.close();
});