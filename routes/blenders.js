const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Blender, validate} = require('../models/blender')
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    const blenders = await Blender.find().sort('name');
    res.send(blenders);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let blender = new Blender({ name: req.body.name });
  blender = await blender.save();

  res.send(blender);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const blender = await Blender.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
     new: true
  });

  if (!blender) return res.status(404).send('The blender with the given ID was not found.');

  res.send(blender);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const blender = await Blender.findByIdAndRemove(req.params.id);

  if (blender) return res.status(404).send('The blender with the given ID was not found.');

  res.send(blender);
});

router.get('/:id', validateObjectId, async (req, res) => {

  const blender = await Blender.findById(req.params.id);

  if (!blender) return res.status(404).send('The blender with the given ID was not found.');

  res.send(blender);
});


module.exports = router;