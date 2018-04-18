
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const {User} = require('../users/models');
const {Question} = require('../questions/models');
const {app} = require('../index');

const userSeedData = require('./user-seed-data');



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

describe('Users GET endpoint', function(){

    it('Should return all Users', function(){

        return User.insertMany(userSeedData)
        .then(() => {
            return chai.request(app)
            .get('/api/users')
            .then( res => {
                const users = res.body;
                expect(users).to.be.an('array');
                expect(users).to.have.lengthOf(3);
                expect(users[0]).to.not.be.empty;
                expect(users[1]).to.not.be.empty;
                expect(users[2]).to.not.be.empty;
            });
        });
    });

    it('Should serialize users', function(){

        return User.insertMany(userSeedData)
        .then(() => {
            return chai.request(app)
            .get('/api/users')
            .then( res => {
                console.log(res.body);
                const user = res.body[0];
                expect(user).to.have.property('id');
                expect(user).to.have.property('username');
                expect(user).to.have.property('firstName');
                expect(user).to.have.property('lastName');
                expect(user).to.not.have.property('password');
            });
        });
    });
});

