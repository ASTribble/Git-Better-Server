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
    let userId,
        authToken;

    beforeEach(function() {
        console.info('seeding question data');
        return Question.insertMany(questionsTestData)   
        .then(() => {
            return User.hashPassword(user.password)
        })
        .then(password => {
            console.info('Creating user');
			return User.create({
				username: user.username,
				password: password,
				firstName: user.firstName,
				lastName: user.lastName
            });
        })
        .then(res => {
            console.log('created user:', res);
            userId = res._id;
            return chai.request(app)
            .post('/api/auth/login')
            .send({username: user.username, password: user.password})
            .then(res => {
                console.log('should have authToken:', res.body)
                authToken = res.body.authToken; 
                return;  
            })
        });
    });

    
    it.only('Should add questions to new user', function(){
        console.log('AUTH TOKEN', authToken);
        return chai.request(app)
            .get('/api/questions/v2')
            .set('authorization', `Bearer ${authToken}`)
            .then(() => {
                return User.findById(userId);
            })
            .then(_user => {
                console.log('user after questions added', _user);
                expect(_user).to.have.property('questions').that.is.an('array');
                
                const questions = _user.questions;
                expect(questions).to.not.be.empty;
                expect(questions).to.have.lengthOf(5);
                
                expect(questions[0]).to.have.property('timesAsked', 0);
                expect(questions[0]).to.have.property('correct', 0);
                expect(questions[0]).to.have.property('question', 'This is index 0');
                expect(questions[0]).to.have.property('answer', 'answer zero');
                expect(questions[0]).to.have.property('next', 1);

                expect(questions[4]).to.have.property('timesAsked', 0);
                expect(questions[4]).to.have.property('correct', 0);
                expect(questions[4]).to.have.property('question', 'This is index 4');
                expect(questions[4]).to.have.property('answer', 'answer four');
                expect(questions[4]).to.have.property('next', null);

                expect(_user).to.have.property('head').that.is.a('number');  
                expect(_user.head).to.deep.equal(0);
            })
    });



});