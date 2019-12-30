const express = require('express');
const blenders = require('../routes/blenders');
const customers = require('../routes/customers');
const programs = require('../routes/programs');
const meals = require('../routes/meals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
   app.use('/api/blenders', blenders);
   app.use('/api/customers', customers);
  app.use('/api/programs', programs);
  app.use('/api/meals', meals);
 app.use('/api/users', users);
 app.use('/api/auth', auth);
 app.use('/api/returns', returns);
 app.use(error);
}