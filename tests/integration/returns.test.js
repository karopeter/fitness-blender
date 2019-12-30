const moment = require('moment');
const request = require('supertest');
const {Meal} = require('../../models/meal');
const {Program} = require('../../models/program');
const {User} = require('../../models/user');
const mongoose = require('mongoose');



describe('/api/returns', () => {
    let server;
    let customerId;
    let programId;
    let meal;
    let token;

    const exec = () => {
        return  request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId,  programId });
    }

  beforeEach(async () => { 
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    programId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
 
      meal = new Meal({
        customer: {
         _id: customerId,
          name: '12345',
          isFitness: '12345'
        },
        program: {
          _id: programId,
          title: '12345',
          dailyMealRate: 2
        }
     });
      await meal.save();
     });


  afterEach(async () => {
     await server.close();
     await Meal.remove({});
     await Program.remove({});
  });
  it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
  });
  it('should return 400 if customerId is not provided', async () => {
       customerId = '';

       const res = await exec();

       expect(res.status).toBe(400);
  });
  it('should return 400 if programId is not provided', async () => {
      programId = '';

      const res = await exec();

      expect(res.status).toBe(400);
  });
  it('should return 404 if no meal found for the customer/program', async () => {
     await Meal.remove({});

     const res = await exec();

     expect(res.status).toBe(404);
  });
  it('should return 400 if return is already processed', async () => {
     meal.dateReturned = new Date();
     await meal.save();

     const res = await exec();

     expect(res.status).toBe(400);
  });
  it('should return 200 if we have a valid request', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
  });
  it('should set the returnDate if input is valid', async () => {
     const res = await exec();

     const mealInDb = await Meal.findById(meal._id);
     const diff = new Date() - mealInDb.dateReturned;
     expect(diff).toBeLessThan(10 * 1000);
  });
  it('should set the mealFee if input is valid', async () => {
       meal.dateOut = moment().add(-7, 'days').toDate();
       await meal.save();

       const res = await exec();

       const mealInDb = await Meal.findById(meal._id);
       expect(mealInDb.mealFee).toBe(14);
  });
  it ('should increase the program videos if input is valid', async () => {
   const res = await exec();
 
   const programInDb = await Program.findById(programId);
   expect(programInDb.workOutVideos).toBe(program.workOutVideos + 1);
});
  it('should return the meal if input is valid', async () => {
     const res = await exec();

     const mealInDb = await Meal.findById(meal._id);

     expect(Object.keys(res.body)).toEqual(
         expect.arrayContaining(['dateOut', 'dateReturned', 'mealFee', 'customer', 'program']));
  });
});