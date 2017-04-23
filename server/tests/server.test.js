const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodos = [{text: "First todo"}, 
{ text: "Second test todo"}];

beforeEach((done) => {
    Todo.remove({}).then(()=>{ // delete all existing Todos
        return Todo.insertMany(testTodos); // afer deleting, insert the test Todos data
    }).then(() => done()); // call done when it done
});

describe ('/GET /todos', ()=>{
    it('should create all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(testTodos.length);    
        })
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