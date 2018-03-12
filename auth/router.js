const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});


const createAuthToken = (user) =>{
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    algorithm: 'HS256',
  });
};

router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
  console.log(`${req.user.username} successfully logged in.`);
  const authToken = createAuthToken(req.user.serialize());
  return res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});


router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};
