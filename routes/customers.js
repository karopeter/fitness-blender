const {Customer, validate} = require('../models/customer');
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

router.put('/:id', async (req, res) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[9].message);

   const customer = await Customer.findByIdAndUpdate(req.params.id, 
    {
      name: req.body.name,
      isFitness: req.body.isFitness,
      signUp: req.body.phone
   }, { new: true });

   if (!customer) return res.status(404).send('The customr with the given ID was not found.');

   res.send(customer);
});

router.post('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', async (req, res) => {
   const customer = await Customer.findById(req.params.id);

   if (!customer) return res.status(404).send('The customer with the given ID was not found.');

   res.send(customer);
});


module.exports = router;