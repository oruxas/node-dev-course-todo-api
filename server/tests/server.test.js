const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server') ;
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');

//testing lifecycle method;
//lets run some code before any tests
//only gona move to test cases once done is called
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        //wipe all todos
        done();
    });
});

describe('POST /todos',()=>{
    it('should create a new todo', (done)=>{
        var text ='Test todo text';

        //object in send gets converted by supertest
        request(app)
        .post('/todos')
        .send({
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })   
        .end((err, res)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                //if either of these fails test still gona pass thus catch is required
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err) => done(err) ); //passing err argument to done
        });
    }); //end it should create todo

    it('should not create todo with invalid data', (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(0);
                done();
            }).catch((err)=> done(err));
        })
    });
});