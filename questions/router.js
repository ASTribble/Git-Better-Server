'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {Question} = require('./models');
const {User} = require('../users/models');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE} = require('../config');

router.use(bodyParser.json());
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
    .then(() => res.json(currentQuestions[0]))
    .catch(err => {
      console.log('Error:', err);
      return res.send(500).json({message: 'Internal Server Error'});
    }
    );
});

//++++++++++++++++++= REFACTOR GET +++++++++++++++++++++++++++++++++++


router.get('/v2', (req, res) => {
  const userID = req.user.id;
  console.log('userID')

  User.findById(userID)
    .then(user => {
      console.log('user in first findById', user);
      //can change to if (user.questions[user.head]) return user.questions[user.head],
      //else do checks for wuestions and head individually
     if (user.questions < 1 || !user.questions){
        Question.find()
          .then(qs => {
            User.findByIdAndUpdate( userID, 
              ({questions: qs}, {head: 0}), 
              {upsert: true, new: true})
          .then(user => res.json(user.questions[user.head])) 
            })
      }
      else if(!user.head){
          User.findByIdAndUpdate( userID, {head: 0}, {upsert:true, new:true})
          .then(user => res.json(user.questions[user.head]))
      } 
      else res.json(user.questions[user.head])
    })
    .catch(err => {
      console.log('Error:', err);
      // return res.send(500).json({message: 'Internal Server Error'});
    }
    );
});




//========================== router.put =============================

router.put('/', (req, res) => {
  //req.body { questionId: "21561345612", answer: "true" }
  // const {questionId, answer} = req.body;
  console.log('req.body', req.body.answer);
  let nextQuestions;
  const userID = req.user.id;

  User.findById(userID)
    .then(user => nextQuestions = user.questions)   //get the questions back from the user
    .then(() => {
      
      if(req.body.answer){     //if the req.body.answer is true
        nextQuestions.push(nextQuestions.shift());
        console.log('if happened');  //push to the end of the array the item that was in the front
      }
      else {              //if the answer was false, take the item that was at the front 
        nextQuestions.splice(1, 0, nextQuestions.shift());  // and splice it into index[1]
        console.log('else happened');
      }
      return User.findByIdAndUpdate(userID, {questions: nextQuestions}, {new: true});  //update the User with the new question list
    })
    //!!!!!!!! This response might break something... make it user.questions if need be!!!!
    .then(user => res.status(200).json(user.questions[0]))
    .catch(err => {
      console.log('Error:', err);
    });
});

module.exports = {router};

//Tauhida Parveen7:38 AM
// question:[]

// question: [{question, answer, next}]

// { question: string, answer: string, next: number

// Tauhida ParveenTauhida Parveen7:50 AM
// user.questions[user.head]

// [{}{}{}{}{}]

// {x}{y}{z}

// Tauhida ParveenTauhida Parveen7:55 AM
// {Y}{X}{X}

// {question: Y, answe:, next:X}

// let answeredQuestion = user.head

// user.head = answeredQuestion.next

// Tauhida ParveenTauhida Parveen8:00 AM
// insertAt(0

// insertAt(4, node)

// user:head {type: NUmber, default: 0}
