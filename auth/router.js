const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();


const localAuth = passport.authenticate('local', {session: false});

router.post('/login', localAuth, (req, res) => {
    console.log(`${req.user.username} successfully logged in.`);
    return res.json({authToken});
})