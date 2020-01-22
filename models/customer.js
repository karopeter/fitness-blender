const Joi = require('joi');
const slugify = require('slugify');
const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: [5, 'A customer must have a less or equal to 5 characters'],
      maxlength: [50, 'A customer must have less or equal to 50 characters']
    },
    slug: String,
    isFitness: {
        type: Boolean,
        default: false
    },
    signUp: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    }
 });

const Customer = mongoose.model('Customer', customerSchema);


// DOCUMENT MIDDLEWARE: runs before .save() .create()
customerSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lowercase: true });
    next();
});


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