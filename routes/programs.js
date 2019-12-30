const {Program, validate} = require('../models/program');
const {Blender} = require('../models/blender');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const programs = await Program.find().sort('name');
   res.send(programs);
});

router.post('/', async (req, res) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const blender = await Blender.findById(req.body.blenderId);
   if (!blender) return res.status(400).send('Invalid blender.');

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

   res.send(program);
});


router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const blender = await Blender.findById(req.body.blenderId);
  if (!blender) return res.status(400).send('Invalid blender.');

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

  if (!program) return res.status(404).send('The program with the given ID was not found.');

  res.send(program);
});

router.delete('/:id', async (req, res) => {
  const program = await Program.findByIdAndRemove(req.params.id);

  if (!program) return res.status(404).send('The program with the given ID was not found.');

  res.send(program);
});

router.get('/:id', async (req, res) => {
  const program = await Program.findById(req.params.id);

  if (!program) return res.status(404).send('The program with the given ID was not found.');

  res.send(program);
});
module.exports = router;