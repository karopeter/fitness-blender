const Joi = require('joi');
const moment = require('moment');
const validate = require('../middleware/validate');
const {Meal} = require('../models/meal');
const {Program} = require('../models/program');
const auth = require('../middleware/auth');
const AppError = require('./../utils/appError');
const express = require('express');
const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async(req, res, next) => {
   // if (!req.body.customerId) return res.status(400).send('customerId  not provided');
  //if (!req.body.programId) return res.status(400).send('programId not provided.');

    const meal = await Meal.findOne({
        'customer._id': req.body.customerId,
        'program._id': req.body.programId,
    });
    if (!meal) {
        return next(new AppError('No mean with the given ID found', 404))
    }

    if (meal.dateReturned) {
       return res.status(400).send('Return already processed.')
    }

    meal.dateReturned = new Date();
    const mealDays = moment().diff(meal.dateOut, 'days') 
    meal.mealFee = mealDays * meal.program.dailyMealRate;
    await meal.save();

    await Program.update({ _id: meal.program._id }, {
        $inc: { workOutVideos: 1 }
    });

     res.status(200).json({
         status: 'success',
         data: {
           meal
         }
     })
});

function validateReturn(req) {
    const schema = {
      customerId: Joi.objectId().required(),
      programId: Joi.objectId().required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;