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
//=================== router.get v1 ==============================

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

    .then(() => res.json(currentQuestions[0]))
    .catch(err => {
      console.log('Error:', err);
      return res.send(500).json({message: 'Internal Server Error'});
    }
    );
});



//++++++++++++++++++= REFACTOR GET v2 +++++++++++++++++++++++++++++++++++


router.get('/v2', (req, res) => {
  
  const userID = req.user.id;

  User.findById(userID)
    .then(user => {

     if (user.questions < 1 || !user.questions){
        //if the user doesn't have any questions, get all the questions from the db 
        // and assign them an initial 'next' value
        Question.find()
          .then(qs => {

            const newQuestions = qs.map((q, i) => ({...q.toObject(), next: i + 1}));
            newQuestions[newQuestions.length-1].next = null;

            User.findByIdAndUpdate( userID, 
              {questions: newQuestions,
              head: 0}, 
              {upsert: true, new: true})

          .then(user => {
            res.json(user.questions[user.head]); 
          })
          
          .catch(err => console.log('line 67 error', err));
        })
      }
      else if(user.head === undefined || user.head === null){
          User.findByIdAndUpdate( userID, {head: 0}, {upsert:true, new:true})
          .then(user => res.json(user.questions[user.head]))
      } 
      else res.json(user.questions[user.head])
    })
    .catch(err => {
      return res.send(500).json({message: 'Internal Server Error'});
    }
    );
});




//========================== router.put v1 =============================

// This was the first interation of the spaced-repitition algorithm.
// It utilizes array methods to reconfigure the array after a wuestion has been answered.

router.put('/', (req, res) => {

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


//++++++++++++++++++++++++++ PUT REFACTOR v2 +++++++++++++++++++++++++++++++++

// In the refactor, we still use an array for the storage of questions, 
// But by assigning a 'next' to each array object, we turned the array into a linked list.
// This way, the actual items in the array never move, only the indicators for which item 
// comes next.
// We also added tracking for how many times a question had been asked as well as how many
// times it was answered correctly.


router.put('/v2', (req, res) => {
  //req.body === { questionId: "21561345612", answer: "true" }

  const answer = req.body.answer;
  const userID = req.user.id;

  // if the answer is true, we want to make user.questions[user.questions.length - 1].next = head
 // and then move user.head to questions[user.head.next] OR if (!user.head.next) user.head++
//basically, the logic for insertLast

  User.findById(userID)
    .then(user => {

      const questions = user.questions;
      let head = user.head;

      questions[head].timesAsked++;

 //with the item at questions[head], we're going to add correct: Number timesAsked: Number
 //if answer is true, correct++, else don't do anything, either way, timesAsked++      
      if(answer){

          questions[head].correct++;

        //insertLast(item)
          let tempIndex = head;
          let initialHead = head; 

          while(questions[tempIndex].next !== null){
            tempIndex = questions[tempIndex].next;
          } 
          questions[tempIndex].next = head;
          head = questions[head].next;
          questions[initialHead].next = null;
      }
      else {
        //insertAt position 2 => head.next.next(.next)
        const nextHead = questions[head].next;
        let tempIndex = head;
        let prevIndex;

        for(let i = 0; i < 2; i++){
          prevIndex = tempIndex;
          tempIndex = questions[tempIndex].next;
        }
        //tempIndex is now the value at head.next.next
        questions[head].next = questions[tempIndex].next;
        questions[tempIndex].next = head;
        head = nextHead;
      }

      return User.findByIdAndUpdate(userID, {questions, head}, {new: true}); 
    })

    .then(user => {
      return res.json('Things went well.');
    })
    .catch(err => console.log('error in put/v2', err));     
  }); 

module.exports = {router};

