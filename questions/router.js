const express = require('express');
const bodyParser = require('body-parser');
const {Question} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

const {DATABASE} = require('../config');

router.get('/', (req, res) => {
  res.json({question: 'sample question', answer: 'sample answer'});
});


module.exports = {router};
