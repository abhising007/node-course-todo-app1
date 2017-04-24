const {ObjectId}=require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((res) => {
//     console.log(res);
// });

// Todo.findOneAndRemove();

var todo_id = '58fd7d02e7ff7ae764b32d63';


Todo.findByIdAndRemove(todo_id).then((todo) => console.log(todo));


// if (!ObjectId.isValid(todo_id)){
//     console.log('Id not value');
// };

// Todo.find({
//     _id: todo_id
// }).then((todos) => {
//     console.log('todos:::: ', todos);
// });

// Todo.findOne({    
//     _id: todo_id}).then(todo => {
//         console.log('todo:::: ', todo);
//     });

// Todo.findById(todo_id).then(todo => {
//     if(!todo) {
//         return console.log('Id not found');
//     }
//     console.log('todoById:::: ', todo);
// }).catch((e)=> {
//     console.log('error',e);
// });

// User.findById('58fcd577e7ff7ae764b325fc').then((user) => {
//     if (!user){
//         return console.log('User id not found');
//     }
//     console.log('User id ::::', user);
// }).catch((e) => {
//     console.log('Error ', e);
// });