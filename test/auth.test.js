
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const {User} = require('../users/models');
const {Question} = require('../questions/models');
const {app} = require('../index');

const {JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');

const userTestData = require('./user-test-data');



describe('Auth Post Endpoint', function(){

    //we'll need this user for all the tests
    const user = userTestData[0];

    //before we can check authorization,
    //we have to make a user to check against.
    beforeEach(function() {
        return User.hashPassword(user.password)
        .then(password => {
			User.create({
				username: user.username,
				password: password,
				firstName: user.firstName,
				lastName: user.lastName
            });
        });
	});


    it('Valid user returns authtoken', function(){

        return chai.request(app)
            .post('/api/auth/login')
            .send({username: user.username, password: user.password})
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('authToken');
            });
    });

    it('Should reject user with invalid password', function(){

        return chai.request(app)
        .post('/api/auth/login')
        .send({username: user.username, password:'badPassword'})
        .then( res => {
            console.log('There was no error');
        })
        .catch(err => {
            const error = err.response;
            expect(error).to.have.status(401);
            expect(error.unauthorized).to.be.true;
            expect(error.clientError).to.be.true;
            expect(error.serverError).to.be.false;
        });  
    });


    it('Should reject unregistered user', function(){

        return chai.request(app)
        .post('/api/auth/login')
        .send({username: 'badUser', password:'badPassword'})
        .then( res => {
            console.log('There was no error');
        })
        .catch(err => {
            const error = err.response;
            expect(error).to.have.status(401);
            expect(error.unauthorized).to.be.true;
            expect(error.clientError).to.be.true;
            expect(error.serverError).to.be.false;
        });  
    });

});