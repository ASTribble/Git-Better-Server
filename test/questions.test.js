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


describe('Questions v2 Endpoints', function(){
    
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

    
    it('GET endpoint should add questions to new user', function(){
     
        return chai.request(app)
            .get('/api/questions/v2')
            .set('authorization', `Bearer ${authToken}`)
            .then(() => {
                return User.findById(userId);
            })
            .then(_user => {
                
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

    it('GET endpoint should return one question', function(){
       
        return chai.request(app)
            .get('/api/questions/v2')
            .set('authorization', `Bearer ${authToken}`)
            .then(res => {
                const question = res.body;

                expect(question).to.be.an('object');
                expect(question).to.be.not.empty;
                
                expect(question).to.have.property('_id');
                expect(question).to.have.property('question').that.is.a('string');
                expect(question).to.have.property('answer').that.is.a('string');
                expect(question).to.have.property('timesAsked').that.is.a('number');
                expect(question).to.have.property('correct').that.is.a('number');
                expect(question).to.have.property('next').that.is.a('number');          
            });
    });

    it('PUT endpoint should properly update if user answers correctly', function(){

        return chai.request(app)
            .get('/api/questions/v2')
            .set('authorization', `Bearer ${authToken}`)
            .then(res => {
                const question = res.body;
                return chai.request(app)
                .put('/api/questions/v2')
                .set('authorization', `Bearer ${authToken}`)
                .send( {questionId: question._id, answer: true })
            })
            .then(() => {
                return User.findById(userId);
            })
            .then( updatedUser => {
                expect(updatedUser.head).to.deep.equal(1);

                const questions = updatedUser.questions;
                expect(questions).to.be.an('array').that.has.lengthOf(5);

                expect(questions[0]).to.have.property('timesAsked', 1);
                expect(questions[0]).to.have.property('correct', 1);
                expect(questions[0]).to.have.property('question', 'This is index 0');
                expect(questions[0]).to.have.property('answer', 'answer zero');
                expect(questions[0]).to.have.property('next', null);
            
                expect(questions[4]).to.have.property('timesAsked', 0);
                expect(questions[4]).to.have.property('correct', 0);
                expect(questions[4]).to.have.property('question', 'This is index 4');
                expect(questions[4]).to.have.property('answer', 'answer four');
                expect(questions[4]).to.have.property('next', 0);      
                
            });
    });


    it('PUT endpoint should update if User answers incorrectly', function(){

        return chai.request(app)
            .get('/api/questions/v2')
            .set('authorization', `Bearer ${authToken}`)
            .then(res => {
                const question = res.body;
                return chai.request(app)
                .put('/api/questions/v2')
                .set('authorization', `Bearer ${authToken}`)
                .send( {questionId: question._id, answer: false })
               })
               .then(() => {
                   return User.findById(userId);
               })
               .then( updatedUser => {
                   expect(updatedUser.head).to.deep.equal(1);

                   const questions = updatedUser.questions;
                   expect(questions).to.be.an('array').that.has.lengthOf(5);

                   expect(questions[0]).to.have.property('timesAsked', 1);
                   expect(questions[0]).to.have.property('correct', 0);
                   expect(questions[0]).to.have.property('question', 'This is index 0');
                   expect(questions[0]).to.have.property('answer', 'answer zero');
                   expect(questions[0]).to.have.property('next', 3);
              
                   expect(questions[2]).to.have.property('timesAsked', 0);
                   expect(questions[2]).to.have.property('correct', 0);
                   expect(questions[2]).to.have.property('question', 'This is index 2');
                   expect(questions[2]).to.have.property('answer', 'answer two');
                   expect(questions[2]).to.have.property('next', 0);      
                   
               });
    });



});