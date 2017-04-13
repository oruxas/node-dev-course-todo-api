const expect = require('expect');
const request = require('supertest');

const {ObjectId} = require('mongodb');

const {app} = require('./../server') ;
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

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
const todos = [{
    _id: new ObjectId(),
    text: "First test todo"
}, {
     _id: new ObjectId(),
    text: "Second test todo",
    completed: true,
    completedAt: 444
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos); //return allows to chain callbacks
    }).then(()=> done());
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
});