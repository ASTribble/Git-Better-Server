'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;


// const {dbConnect, dbDisconnect} = require('../db-mongoose');

const {User} = require('../users/models');
const {Question} = require('../questions/models');
const {seedData} = require('../questions/seedData');
const {app, runServer, closeServer} = require('../index');
const {TEST_DATABASE_URL} = require('../config');
// const {dbConnect, dbDisconnect} = require('../db-knex');

chai.use(chaiHttp);

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

//drops the database so there is a fresh start

before(function() {
    console.log('running server');
    return runServer(TEST_DATABASE_URL);
});

beforeEach(function() {
    console.info('seeding question data');
    return Question.insertMany(seedData);
});

afterEach(function() {
    console.log('dropping database');
    return mongoose.connection.dropDatabase();
});

after(function() {
    return closeServer();
});

//======== Beginning of Tests ==========================

describe('Mocha and Chai', function() {
    it('should be properly setup', function() {
        expect(true).to.be.true;
    });
});

describe('User POST endpoint', function(){
    
    const 
        firstName = 'Kermit',
        lastName = 'Frog',
        username = 'Kermie',
        password = 'banjoesRock',
        stageName = 'Oscar';

    it('Should create a new User', function(){

        const newUser = {
            firstName,
            lastName,
            username,
            password,
            stageName
        };


        return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(function() {
            return User.find();
        })
        .then( res => {
            expect(res).to.be.an('array');
            const user = res[0];
            expect(user.username).to.deep.equal(newUser.username);
            expect(user.firstName).to.deep.equal(newUser.firstName);
            expect(user.lastName).to.deep.equal(newUser.lastName);
            expect(user.password).to.not.equal(newUser.password);
            expect(user._id).to.exist;
            expect(user._id).to.not.be.empty;
            expect(user.stageName).to.not.exist;
        });
    });

    it('Should reject missing password', function(){

        const badUser = {
            firstName,
            lastName,
            username
        }

        return chai.request(app)
        .post('/api/users')
        .send(badUser)
        .then((res) => {
            console.log('There was no error');
        })
        .catch(_err => {
            expect(_err).to.have.status(422);

            const err = _err.response.body;

            expect(err).to.have.property('code');
            expect(err).to.have.property('reason');
            expect(err).to.have.property('message');
            expect(err).to.have.property('location');

            expect(err.code).to.deep.equal(422);
            expect(err.reason).to.deep.equal('Validation Error');
            expect(err.message).to.deep.equal('Missing Field');
            expect(err.location).to.deep.equal('password');
        });
    });

    it('Should reject missing username', function(){

        const badUser = {
            firstName,
            lastName,
            password
        }

        return chai.request(app)
        .post('/api/users')
        .send(badUser)
        .then((res) => {
            console.log('There was no error');
        })
        .catch(_err => {

            expect(_err).to.have.status(422);

            const err = _err.response.body;

            expect(err).to.have.property('code');
            expect(err).to.have.property('reason');
            expect(err).to.have.property('message');
            expect(err).to.have.property('location');

            expect(err.code).to.deep.equal(422);
            expect(err.reason).to.deep.equal('Validation Error');
            expect(err.message).to.deep.equal('Missing Field');
            expect(err.location).to.deep.equal('username');
        });
    
    })
});
