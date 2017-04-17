const {MongoClient, ObjectID} = require('mongodb'); // syntax gets the MongoClient and ObjectID properties of mongoDB object

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db)=>{
    if(error){
        console.log('Unable to connect to Mongodb server', error);
        return;
    }

    
    console.log('Connected to MongoDB server');
    db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {    
        console.log('Result ', result);
    });

    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {    
    //     console.log('Result ', result);
    // });


    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result) => {    
    //     console.log('Result ', result);
    // });
    

    // db.close();
});