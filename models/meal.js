const Joi = require('joi');
const mongoose = require('mongoose');

const Meal = mongoose.model('Meal', new mongoose.Schema({
   customer: {
      type: new mongoose.Schema({
         name: {
             type: String,
             required: true,
             minlength: 5,
             maxlength: 50
         },
         isFitness: {
             type: String,
             required: true,
             minlength: 5,
             maxlength: 50
         }
      }),
      required: true
   },
   program: {
       type: new mongoose.Schema({
         title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 255
         },
         dailyMealRate: {
             type: Number,
             required: true,
             min: 0,
             max: 255
         }
       }),
       required: true
   },
   dateout: {
      type: Date,
      required: true,
      default: Date.now
   },
   dateReturned: {
     type: Date
   },
   mealFee: {
      type: Number,
      min: 0
   }
}));

function validateMeal(meal) {
    const schema = {
        customerId: Joi.objectId().required(),
        programId: Joi.objectId().required()
    };

    return Joi.validate(program, schema);
}

exports.Meal = Meal;
exports.validate = validateMeal;