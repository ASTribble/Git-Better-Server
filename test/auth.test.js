
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const {User} = require('../users/models');
const {Question} = require('../questions/models');
const {app} = require('../index');

const {JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');

const userSeedData = require('./user-seed-data');

describe('Auth Post Endpoint', function(){
    
    const user = userSeedData[0];

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



});