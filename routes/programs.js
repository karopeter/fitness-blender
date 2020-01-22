const {Program, validate} = require('../models/program');
const {Blender} = require('../models/blender');
const AppError = require('./../utils/appError');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const programs = await Program.find().sort('name');
   res.send(programs);
});

router.post('/', async (req, res, next) => {
   const blender = await Blender.findById(req.body.blenderId);
   if (!blender) {
      return next(new AppError('No program with the given ID found', 400))
   }

   const program = new Program({
     title: req.body.title,
     blender: {
        _id: blender._id,
        name: blender.name
     },
     workOutVideos: req.body.workOutVideos,
     dailyWorkExcersis: req.body.dailyWorkExcersis
   });
   await Program.save();

   res.status(200).json({
     status: 'success',
     data: {
       program
     }
   });
});


router.put('/:id', async (req, res, next) => {
  const blender = await Blender.findById(req.body.blenderId);
  if (!blender) {
    return next(new AppError('No blender with given ID found', 404))
  }

  const program = await Program.findByIdAndUpdate(req.params.id, 
    {
    title: req.body.title,
    blender: {
        _id:  blender._id,
        name: blender.name
    },
    workOutVideos: req.body.workOutVideos,
    dailyWorkExcersis: req.body.dailyWorkExcersis
  }, { new: true });

  if (!program) {
    return next(new AppError('No program with given ID found', 404))
  }

   res.status(200).json({
      status: 'success',
      data: {
       program
      }
   });
});

router.delete('/:id', async (req, res, next) => {
  const program = await Program.findByIdAndRemove(req.params.id);

  if (!program) {
     return next(new AppError('No program with given ID found', 404))
  }

  res.status(204).json({
    status: 'success',
    data: {
      program
    }
  });
});

router.get('/:id', async (req, res, next) => {
  const program = await programs.findById(req.params.id);

  if (!program) {
     return next(new AppError('No program with the given ID found', 404))
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      program
    }
  });
});

module.exports = router;