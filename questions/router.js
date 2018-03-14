const express = require('express');
const bodyParser = require('body-parser');
const {Question} = require('./models');
const {User} = require('../users/models');
const router = express.Router();
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE} = require('../config');

//=================== router.get ==============================

router.get('/', (req, res) => {
  const userID = req.user.id;

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
    //change this to only send back currentQuestions[0] when it won't break the client
    .then(() => res.json(currentQuestions))
    .catch(err => {
      console.log('Error:', err);
      return res.send(500).json({message: 'Internal Server Error'});
    }
  );
});

//========================== router.put =============================

router.put('/', (req, res) => {
  //req.body { questionId: "21561345612", answer: "true" }
  // const {questionId, answer} = req.body;
  let nextQuestions;
  const userID = req.user.id;

  User.findById(userID)
    .then(user => nextQuestions = user.questions)   //get the questions back from the user
    .then(() => {
      
      if(req.body.answer){     //if the req.body.answer is true
        nextQuestions.push(nextQuestions.shift());  //push to the end of the array the item that was in the front
      }
      else {              //if the answer was false, take the item that was at the front 
        nextQuestions.splice(1, 0, nextQuestions.shift());  // and splice it into index[1]
      }
      return User.findByIdAndUpdate(userId, {questions: nextQuestions}, {new: true});  //update the User with the new question list
    })
    .then(() => res.send('Next Questions saved and ready'))
    .catch(err => {
      console.log('Error:', err);
    });
});

module.exports = {router};
