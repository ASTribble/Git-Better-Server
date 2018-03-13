const express = require('express');
const bodyParser = require('body-parser');
const {Question} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

const {DATABASE} = require('../config');

router.get('/', (req, res) => {
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


module.exports = {router};
