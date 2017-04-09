const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server') ;
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');

//testing lifecycle method;
//lets run some code before any tests
//only gona move to test cases once done is called
// beforeEach((done)=>{
//     Todo.remove({}).then(()=>{
//         //wipe all todos
//         done();
//     });
// });

//Creating dummy todos
const todos = [{
    text: "First test todo"
}, {
    text: "Second test todo"
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