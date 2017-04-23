const express = require('express');
const bodyParser = require('body-parser');

var {mongoose}  = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

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

app.listen(3000, ()=>{
    console.log('Server is up');
});

module.exports = {
    app
};