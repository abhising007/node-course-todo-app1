const express = require('express');
const bodyParser = require('body-parser');

const {ObjectId}=require('mongodb');
var {mongoose}  = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

const port = process.env.PORT || 3000; // default to port 3000 for running locally.Otherwise use heroku port. 

var app = express();

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
         console.log('Unable to get todos');
         res.status(400).send(e);
     });
});

// GET /todos/{id}
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!id || !ObjectId.isValid(id)) {
        console.log('Id not valid');
        res.status(404).send('Id not valid');
    }
    Todo.findById(id).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send('')
    });
});

app.post('/todos', (req, res)=>{
    var todo = new Todo({
        text: req.body.text
    });

     todo.save().then((doc) => {
         console.log('Saved todo', todo);
         res.send(doc); 
     }, (e) => {
         console.log('Unable to save todo');
         res.status(400).send(e);
     });
    // console.log(req, res);
});

app.listen(port, ()=>{
    console.log(`Server is up at ${port}`);
});

module.exports = {
    app
};