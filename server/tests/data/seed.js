const {ObjectId}=require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const user1Id = new ObjectId();
const user2Id = new ObjectId();

const users = [
    {
        _id: user1Id,
        email: 'abs@abs.com',
        password: 'abcde11',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: user1Id, access: 'auth'}, 'somescrete').toString()
        }]
    }, 
    {
        _id: user2Id,
        email: 'abcded@abc.com',
        password: 'abcde22',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: user2Id, access: 'auth'}, 'somescrete').toString()
        }]
    }
];

const testTodos = [
    {
    _id: new ObjectId(),
    text: "First todo",
    _creator: user1Id
    }, 
    {
        _id: new ObjectId(),
        text: "Second test todo",
        completed: true,
        completedAt: 2010,
        _creator: user2Id
    }];

const populateTodos = (done) => {
    Todo.remove({}).then(()=>{ // delete all existing Todos
        return Todo.insertMany(testTodos); // afer deleting, insert the test Todos data
    }).then(() => done()); // call done when it done
};

const populateUsers = (done) => {
    User.remove({}).then( () => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = {testTodos, populateTodos, users, populateUsers};