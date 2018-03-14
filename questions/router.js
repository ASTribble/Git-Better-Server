const express = require('express');
const bodyParser = require('body-parser');
const {Question} = require('./models');
const {Users}
const router = express.Router();
const jsonParser = bodyParser.json();

const {DATABASE} = require('../config');

router.get('/', (req, res) => {
  const userID = req.user.id;

  User.findById(userID)
    .then(user => user.questions)
    .then(questions => 
    console/log(questions));

  return Question.find()
    .then((q) => {
      console.log(q);
      return res.json(q);
    })
    .catch((err) => {
      console.error(err);
      return res.send(500).json({message: 'Internal Server Error'});
    });
});

router.put('/', (req, res) => {
  const user = req.user;
  console.log(user);
  console.log(req.body);
  return res.status(200).send();
});

module.exports = {router};
