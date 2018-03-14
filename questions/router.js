const express = require('express');
const bodyParser = require('body-parser');
const {Question} = require('./models');
const {User} = require('../users/models');
const router = express.Router();
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE} = require('../config');

router.get('/', (req, res) => {
  const userID = req.user.id;
  // console.log('user',req.user.id);
  let currentQuestions;

  User.findById(userID)
    .then(user => user.questions)
    .then(questions => {
     if (questions < 1 || !questions){
       return Question.find()
       .then(qs => currentQuestions = qs)
       .then(() => User.findByIdAndUpdate(userID, {questions: currentQuestions}, {new: true}))
       .then(u => console.log('user after update:', u)) 
     }
     else {
       currentQuestions = questions;
     }
    })
    .then(() => res.json(currentQuestions))
    .catch(err => {
      console.log('Error:', err);
      return res.send(500).json({message: 'Internal Server Error'});
    }
  );
});

router.put('/', (req, res) => {
  const user = req.user;
  console.log(user);
  console.log(req.body);
  return res.status(200).send();
});

module.exports = {router};
