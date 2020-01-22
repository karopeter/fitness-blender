const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Blender, validate} = require('../models/blender');
const AppError = require('./../utils/appError');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    const blenders = await Blender.find().sort('name');


     res.status(200).json({
        status: 'success',
        results: blenders.length,
        data: {
          blenders
        }
     });
});

router.post('/', auth, async (req, res, next) => {
   const { error }  = await Blender.findOne(req.params.validate);

  if (!error) {
    return next(new AppError('No Blender found with that ID', 400))
  }

  let blender = new Blender({ name: req.body.name });
  
   res.status(200).json({
     status: 'success',
     data: {
       blender
     }
   });
});

router.put('/:id', [auth, validateObjectId], async (req, res, next) => {
    const blender = await Blender.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      validate: true
    });

    if (!blender) {
      return next(new AppError('No blender found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        blender
      }
    });
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const blender = await Blender.findByIdAndDelete(req.params.id);

    if (!blender) {
      return next(new AppError('Not Blender with that ID', 404))
    }

    res.status(204).json({
       status: 'success',
       data: null
    });
});

router.get('/:id', validateObjectId, async (req, res) => {
   const id =  req.params.id;
   const blender = blenders.find(el => el.id === id);
   if (!blender) {
     return res.status(404).json({
       status: 'fail',
       message: 'Invalid ID'
     });
   }
   res.status(200).json({
     status: 'success',
     data: {
       blender
     }
   });
});


module.exports = router;