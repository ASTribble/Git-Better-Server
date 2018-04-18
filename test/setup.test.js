'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const {runServer, closeServer} = require('../index');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');


//starts the server at the beginning of the tests running
before(function() {
    console.log('running server');
    return runServer(TEST_DATABASE_URL);
});


//drops the database after each 'it' block so there is a fresh start
afterEach(function() {
    console.log('dropping database');
    return mongoose.connection.dropDatabase();
});

//shuts down the server after the tests complete
after(function() {
    return closeServer();
});


// makes sure mocha and chai are running properly
describe('Mocha and Chai', function() {
    it('should be properly setup', function() {
        expect(true).to.be.true;
    });
});
