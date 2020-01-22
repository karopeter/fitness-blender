const {Customer, validate} = require('../models/customer');
const AppError = require('./../utils/appError');
const express = require ('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);

   let customer = new Customer({
     name: req.body.name,
     isFitness: req.body.isFitness,
     signUp: req.body.signUp
   });
   customer = await customer.save();

   res.send(customer);
});

router.post('/:id', async (req, res, next) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return next(new AppError('No customer with that ID found', 400))
  }

  res.send(customer);
});


router.put('/:id', async (req, res, next) => {
  const customer = await Blender.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    validate: true
  });

  if (!customer) {
    return next(new AppError('No customer found with that ID', 404))
  }


    customer = await Customer.findByIdAndUpdate(req.params.id, 
    {
      name: req.body.name,
      isFitness: req.body.isFitness,
      signUp: req.body.signUp
   }, { new: true });

   res.status(200).json({
      status: 'success',
      data: {
        customer
      }
   });
});


router.get('/:id', async (req, res, next) => {
   const customer = await customers.findById(req.params.id);

   if (!customer) {
     return next(new AppError('No customer found with that ID', 404))
   }
  res.status(200).json({
    status: 'sucess',
    data: {
      customer
    }
  })
});


module.exports = router;