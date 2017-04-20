const expect = require('expect');
const request = require('supertest');

const {ObjectId} = require('mongodb');

const {app} = require('./../server') ;
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const{todos, populateTodos, users, populateUsers} = require('./seed/seed');

//testing lifecycle method;
//lets run some code before any tests
//only gona move to test cases once done is called
// beforeEach((done)=>{
//     Todo.remove({}).then(()=>{
//         //wipe all todos
//         done();
//     });
// });


//Creating dummy todos (seed data)
beforeEach(populateUsers);
beforeEach(populateTodos);

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

            Todo.find({text}).then((todos)=>{
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
                expect(todos.length).toBe(2);
                done();
            }).catch((err)=> done(err));
        })
    }); //end not create with wrong data

}); //end describe POST

describe('GET /todos',()=>{
      it('shoud get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
      }); //end get all todos test

});//end describe GET

describe('GET /todos/:id', ()=>{
    it('should return todo doc', (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('shoud return 404 if todo not found', (done)=>{
        // option2: var hexId = new ObjectId().toHexString(); 
         var hexId = new ObjectId().toHexString(); 
        request(app)
            .get(`/todos/${hexId}`) //need to pass completely new id not from existing todos array
            .expect(404)
            .end(done);
    });

    it('should return 404 for none-object ids',(done)=>{
        request(app)
            .get(`/todos/${123}`)
                .expect(404)
                .end(done);
    });
});// end describe GET by id

describe('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toNotExist();
                    done();
                }).catch((err)=> done(err));

            });

    });

    it('should return 404 if todo not found', (done)=>{
           var hexId = new ObjectId().toHexString(); 
            request(app)
            .delete(`/todos/${hexId}`) //need to pass completely new id not from existing todos array
            .expect(404)
            .end(done);
    });
    it('should retrn 404 if object id is invalid', (done)=>{
        request(app)
            .delete(`/todos/${123}`)
                .expect(404)
                .end(done);
    });
}); //end delete todo by id


describe('PATCH /todos/:id', ()=>{
    it('should update the todo', (done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = "this shpuld be updated text";

        request(app)
            .patch(`/todos/${hexId}`)
            .send({     //things we wanna change
                completed: true,
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done)=>{
        var hexId = todos[1]._id.toHexString();
        var text = "this shpuld be updated text!!";

        request(app)
            .patch(`/todos/${hexId}`)
            .send({     //things we wanna change
                completed: false,
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});//end Describe Patch

describe('GET /users/me', ()=>{
    it('should return user if autjenticate', (done)=>{
        //supertest again
        request(app)
            .get('/users/me')
            //header name + value as arguments to.set
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                //emails
                expect(res.body.email).toBe(users[0].email);
              
            }).end(done).timeout(3000);//timeout to override 2000ms
    });

    //no token is provided, random data not provided for someone who shouldn't have access to it
    it('should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
                .expect(401) //sent back by authenticate middleware
                //body to be empty object , should be if not authenticated
                .expect((res)=>{
                    expect(res.body).toEqual({ });
                }).end(done);
    });
});//end describe GET users/me

describe('POST /users', ()=>{

    //valid datata 
    it('should create user', (done)=>{
        var email = "example@example.com";
        var password = "123mnb";
        request(app)
            .post('/users')
            .send({email, password})    //request sent
            .expect(200)
            .expect((res)=>{
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            }).end((err)=>{
                //custom function
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password); //should be hashed already
                    done();
                })
            });

    });

    //invalid
    it('should return invalidation errors if request invalid', (done)=>{
        var invalidEmail = "example";
        var invalidPassword = "";
        request(app)
            .post('/users')
            .send({email: invalidEmail, password: invalidPassword})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done)=>{
        //email from seed
        var email = users[0].email;
        var password = "123mnb";
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

});//end describe post (signup)

