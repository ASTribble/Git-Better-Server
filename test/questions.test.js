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
const questionsTestData = require('./questions-test-data');


describe('Questions GET Endpoint', function(){
    
    const user = userTestData[0];
    let authToken;

    beforeEach(function() {
        console.info('seeding question data');
        return Question.insertMany(questionsTestData)   
        .then(() => {
            return User.hashPassword(user.password)
        })
        .then(password => {
            console.log('Creating user');
			return User.create({
				username: user.username,
				password: password,
				firstName: user.firstName,
				lastName: user.lastName
            });
        })
        .then(res => {
            console.log('res', res)
            return chai.request(app)
            .post('/api/auth/login')
            .send({username: user.username, password: user.password})
            .then(res => {
                console.log('should have authToken:', res.body)
                authToken = res.body.authToken;   
            })
        })
        .catch(err => {
            console.log('ERROR!!!!!!!!!!!!', err)
        }); 
    });

    
    it.only('Should run', function(){
        expect(true).to.be.true;
    });

});