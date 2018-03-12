const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();

const createAuthToken = (user) =>{
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    algorith: 'HS256',
  });
};

const jwtAuth = passport.authenticate('jwt', {session: false});

module.exports = {router};
