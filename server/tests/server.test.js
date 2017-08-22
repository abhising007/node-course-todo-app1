const {ObjectId}=require('mongodb');

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {testTodos, populateTodos, users, populateUsers} = require('./data/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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


describe ('/PATCH /todos/:id', ()=>{
    it('should update a todo for passed id', (done) => {
        var newText = "New text";
        var completed = true;
        request(app)
        .patch(`/todos/${testTodos[0]._id.toHexString()}`)
        .send({text: newText, completed: completed})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(newText);    
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });


    it('should clear the completedAt when todo is not completed', (done) => {
        var newText = "New text!";
        var completed = false;
        request(app)
        .patch(`/todos/${testTodos[1]._id.toHexString()}`)
        .send({text: newText, completed: completed})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(newText);
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
    
});

describe('GET /users/me', () => {
    it('should return user of authenticated', (done) =>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return a 401 if not authenticated', (done) =>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({}); // body should be empty
        })
        .end(done);
    });
});


describe('POST /users', () => {
    it('should create a user', (done) =>{
        var email = "newEmail@email.com";
        var password = "abcd1234";

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }
            User.findOne({email}).then( (user)=>{
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((e) => done(e));   
        });
    });

    it('should return validation errors if request is invalid', (done) =>{
        var email = "invalidemail";
        var password = "abcd1234";

        // test for invalid email
        request(app)
        .post('/users')
        .send({email:'invalidemail', password:'abc1234'})
        .expect(400)
        .end(done);

    });

    it('should not create user if email already in use', (done) =>{

        // test for duplicate email
        request(app)
        .post('/users')
        .send({email:users[0].email, password:'abc1234'})
        .expect(400)
        .end(done);

    });

});

describe ('/POST /users/login', ()=>{
    it('should login user and return token', (done)=> {
        request(app)
        .post('/users/login')
        .send({email:users[1].email, password: users[1].password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body.email).toBe(users[1].email);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e) => done(e));   
        });
    });

    it('should reject invalid user', (done)=> {
        request(app)
        .post('/users/login')
        .send({email:users[1].email, password: 'invalid'})
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
            expect(res.body).toEqual({});
        })
        .end(done);
    });
    
});