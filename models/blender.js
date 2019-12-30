const Joi = require('joi');
const mongoose = require('mongoose');

const blenderSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
  }
});


const Blender = mongoose.model('Blender', blenderSchema);

function validateBlender(blender) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(blender, schema);
}

exports.blenderSchema = blenderSchema;
exports.Blender = Blender;
exports.validate = validateBlender;