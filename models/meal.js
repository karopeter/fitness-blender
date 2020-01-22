const Joi = require('joi');
const mongoose = require('mongoose');

 const mealSchema = new mongoose.Schema({
    customer: {
       type: new mongoose.Schema({
          name: {
              type: String,
              required: true,
              minlength: [5, 'A customer must have a less or equal to 5 characters'],
              maxlength: [50, 'A customer must have less or equal to 50 characters']
          },
          isFitness: {
              type: String,
              required: true,
              minlength: [5, 'A customer must have a less or equal to 5 characters'],
              maxlength: [50, 'A customer must have less or equal to 50 characters']
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
             minlength: [5, 'A program must have less or equal to 5 characters'],
             maxlength: [255, 'A program must have less or eqaul to 255 characters']
          },
          dailyMealRate: {
              type: Number,
              required: true,
              min: 0,
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
 });

const Meal = mongoose.model('Meal', mealSchema);

function validateMeal(meal) {
    const schema = {
        customerId: Joi.objectId().required(),
        programId: Joi.objectId().required()
    };

    return Joi.validate(meal, schema);
}

exports.Meal = Meal;
exports.validate = validateMeal;