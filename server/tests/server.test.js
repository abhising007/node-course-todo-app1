const {ObjectId}=require('mongodb');

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodos = [
    {
    _id: new ObjectId(),
    text: "First todo"
    }, 
    {
        _id: new ObjectId(),
        text: "Second test todo"
    }];

beforeEach((done) => {
    Todo.remove({}).then(()=>{ // delete all existing Todos
        return Todo.insertMany(testTodos); // afer deleting, insert the test Todos data
    }).then(() => done()); // call done when it done
});

describe ('/GET /todos', ()=>{
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(testTodos.length);    
        })
        .end(done);
    });
});

describe ('/GET /todos/:id', ()=>{
    it('should get todo for passed id', (done) => {
        request(app)
        .get(`/todos/${testTodos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(testTodos[0].text);    
        })
        .end(done);
    });

    it('should return 404 if todo is not found', (done) => {
        var newId = new ObjectId().toHexString();
        request(app)
        .get(`/todos/${newId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if ID is not valid', (done) => {
        request(app)
        .get(`/todos/1234`)
        .expect(404)
        .end(done);
    });
    
});


describe ('/POST /todos', ()=>{
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err){ 
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos[0].text).toBe(text);
                expect(todos.length).toBe(1);
                done();
            }).catch((e) => done(e));   
        });
    });


    it('should not create todo with invalid data', (done) => {
        var text = '';
        request(app)
        .post('/todos')
        .send()
        .expect(400)
        .end((err, res) => {
            if (err){ 
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(testTodos.length);
                done();
            }).catch((e) => done(e));   
        });
    });    
});