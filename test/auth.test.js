
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
    
    const user = userTestData[0];

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
            console.log(err.response.unauthorized);
            const error = err.response;
            expect(error).to.have.status(401);
            expect(error.unauthorized).to.be.true;
        });  
    });



});