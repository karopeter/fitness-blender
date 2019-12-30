const {Meal, validate} = require('../models/meal');
const {Customer} = require('../models/customer');
const {Program} = require('../models/program');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();


Fawn.init(mongoose);

router.get('/', async (req, res) => {
   const meals = await Meal.find().sort('-dateout');
   res.send(meals);
});


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const program = await Program.findById(req.body.programId);
  if (!program) return res.status(400).send('Invalid program.');

  if (program.workOutVideos === 0) return res.status(400).send('Program not in stock.');

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
  const meal = await Meal.findById(req.params.id);

  if (!meal) return res.status(400).send('The meal with the given ID was not found.');

   res.send(meal);
});


module.exports = router;