const Joi = require('joi');
const mongoose = require('mongoose');

const blenderSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'A blender must have a name'],
      unique: true,
      trim: true,
      minlength: [5, 'A blender must have less or equal than 5 characters'],
      maxlength: [50, 'A blender must must have less or equal tha 50 characters']
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