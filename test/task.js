const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://localhost:3000';

// Assertion style
chai.should();

chai.use(chaiHttp);

describe('Sign-Up API', () => {
    /* 
        Test the GET route
    */
    describe('GET /', () => {
        it('It should display the signup page', done => {
            chai.request(server)
                .get('/')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.header.should.contain({'content-type': 'text/html; charset=utf-8'});
                    done();
                })
        });

        it('It should not display the signup page', done => {
            chai.request(server)
                .get('/signup')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
            });
        })
    })

    describe('GET /login', () => {
        it('It should display the login page', done => {
            chai.request(server)
                .get('/login')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.header.should.contain({'content-type': 'text/html; charset=utf-8'});
                    done();
                })
        });

        it('It should not display the login page', done => {
            chai.request(server)
                .get('/logins')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
            });
        })
    })

    /* 
        Test the POST route
    */
    describe('POST /', () => {
        it('It should POST a new user', done => {
            const user = {
                username: 'rishav',
                email: 'rishav@yahoo.com',
                password: 'test1',
                confirm: 'test1'
            }
            chai.request(server)
                .post('/')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.request._data.should.be.a('object');
                    response.request._data.should.have.property('username');
                    response.request._data.should.have.property('email');
                    done();
                })
        })

        it('It should not POST a new user without the property email', done => {
            const user = {
                username: 'rishav',
                password: 'test1',
                confirm: 'test1'
            }
            chai.request(server)
                .post('/')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(500);
                    done();
                })
        })

    })
})