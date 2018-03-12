const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});

router.post('/login', localAuth, (req, res) => {
    console.log(`${req.user.username} successfully logged in.`);
    return res.json({authToken});
})

const createAuthToken = (user) =>{
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    algorith: 'HS256',
  });
};

const jwtAuth = passport.authenticate('jwt', {session: false});

module.exports = {router};