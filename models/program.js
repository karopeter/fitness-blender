const Joi = require('joi');
const mongoose = require('mongoose');
const {blenderSchema} = require('./blender');

const programSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, 'A program must have less or equal to 5 characters'],
      maxlength: [255, 'A program must have less or eqaul to 255 characters']
    },
    blender: {
        type: blenderSchema,
        required: true
    },
    workOutVideos: {
        type: Number,
        required: true,
        default: 0
    },
    dailyWorkExcersis: {
        type: Number,
        required: true,
        default: 0
    }
 });

const Program = mongoose.model('Program', programSchema);

function validateProgram(program) {
    const schema = {
        title: Joi.objectId().min(5).max(50).required(),
        blenderId: Joi.string().required(),
        workOutVideos: Joi.number().min(0).required(),
        dailyWorkExcersis: Joi.number().min(0).required()
    };

    return Joi.validate(program, schema);
}

exports.Program = Program;
exports.validate = validateProgram;