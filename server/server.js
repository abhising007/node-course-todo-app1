require('./config/config');


const port = process.env.PORT;
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectId}=require('mongodb');
var {mongoose}  = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.get('/todos', authenticate, (req, res) => {
    console.log('GET /todos call');
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
         console.log('Unable to get todos');
         res.status(400).send(e);
     });
});

// GET /todos/{id}
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!id || !ObjectId.isValid(id)) {
        console.log('Id not valid');
        res.status(404).send('Id not valid');
    }
    Todo.findOne({_id: id, 
        _creator: req.user.id
    }).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send('')
    });
});

// delete by id
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!id || !ObjectId.isValid(id)) {
        console.log('Id not valid');
        res.status(404).send('Id not valid');
    }
    Todo.findOneAndRemove({_id:id, 
        _creator: req.user.id
    }).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send('')
    });
});

// updates by id
app.patch('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']); // pick only properties that can be updated
    
    if(!id || !ObjectId.isValid(id)) {
        console.log('Id not valid');
        res.status(404).send('Id not valid');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        // set completedAt property to now
        body.completedAt = new Date().getTime(); 
    } else {
        // 
        body.completed = false;
        body.completedAt = null; 
    }

    Todo.findOneAndUpdate({_id: id,
        _creator: req.user.id
    }, {
        $set: body
    }, {
        new : true
    }).then((todo)=>{
        if (!todo){
            res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/todos', authenticate, (req, res)=>{
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

     todo.save().then((doc) => {
        //  console.log('Saved todo', todo);
         res.send(doc); 
     }, (e) => {
         console.log('Unable to save todo');
         res.status(400).send(e);
     });
    // console.log(req, res);
});

app.post('/users', (req, res)=>{
    // pick only properties that can be passed
    var body = _.pick(req.body,['email','password']); 
   
    var user = new User(body);

     user.save().then((user) => {
        return user.generateAuthToken(); 
     }).then((token) => {
        // console.log('Saved user', user);
        res.header('x-auth', token).send(user); 
     }).catch((e) => {
         console.log('Unable to save user');
         res.status(400).send(e);
     });
});


// call middleware
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// login users
app.post('/users/login', (req, res)=>{
    // pick only properties that can be passed
    var body = _.pick(req.body,['email','password']); 
    
     User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user); 
        });
     }).catch((e) => {
         console.log('Unable to find user');
         res.status(400).send();
     });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, ()=>{
    console.log(`Server is up at ${port}`);
});

module.exports = {
    app
};