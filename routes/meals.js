const {Meal, validate} = require('../models/meal');
const {Customer} = require('../models/customer');
const {Program} = require('../models/program');
const AppError = require('./../utils/appError');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();


Fawn.init(mongoose);

router.get('/', async (req, res) => {
   const meals = await Meal.find().sort('-dateout');
   res.send(meals);
});


router.post('/', async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return next(new AppError('No meal with the give ID found', 400))
  }

  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    return next(new AppError('No customer with the given ID found', 404))
  }

  const program = await Program.findById(req.body.programId);
  
  if (!program) {
     return next(new AppError('No program with the given ID found', 404))
  }

  if (program.workOutVideos === 0) {
    return next(new AppError('Program not in stock'))
  }

  let meal = new Meal({
      customer: {
          _id: customer._id,
          name: customer.name,
          signUp: customer.signUp
      },
      program: {
        _id: program._id,
        title: program.title,
        dailyMealRate: program.dailyMealRate
      }
  });

  try {
     new Fawn.Task()
       .save('meals', meal)
       .update('program', { _id: program._id}, {
           $inc: { workOutVideos: -1 }
       })
       .run();

       res.send(meal);
  }
  catch(ex) {
     res.status(500).send('Something failed.'); 
  }
});

router.get('/:id', async (req, res) => {
  const meal = await meals.findById(req.params.id);

  if (!meal) {
     return next(new AppError('No meal with the given ID found', 404))
  }
 
   res.status(200).json({
     status: 'success',
     data: {
       meal
     }
   });
});


module.exports = router;