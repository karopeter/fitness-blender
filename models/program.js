const Joi = require('joi');
const mongoose = require('mongoose');
const {blenderSchema} = require('./blender');


const Program = mongoose.model('Program', new mongoose.Schema({
   title: {
     type: String,
     required: true,
     trim: true,
     minlength: 5,
     maxlength: 255
   },
   blender: {
       type: blenderSchema,
       required: true
   },
   workOutVideos: {
       type: Number,
       required: true,
       min: 0,
       max: 255
   },
   dailyWorkExcersis: {
       type: Number,
       required: true,
       min: 0,
       max: 255
   }
}));

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