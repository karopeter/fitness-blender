const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
   name: {
     type: String,
     required: true,
     minlength: 5,
     maxlength: 50
   },
   isFitness: {
       type: Boolean,
       default: false
   },
   signUp: {
       type: String,
       required: true,
       monlength: 5,
       maxlength: 50   
   }
}));

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        signUp: Joi.string().min(5).max(50).required(),
        isFitness: Joi.boolean()
    };

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;