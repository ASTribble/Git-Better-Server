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
    
});