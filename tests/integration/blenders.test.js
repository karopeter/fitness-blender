const request = require('supertest');
const {Blender} = require('../../models/blender');
const {User} = require('../../models/user');
let server;
const mongoose = require('mongoose');

describe('/api/blenders', () => {
   beforeEach(() => { server = require('../../index'); })
   afterEach( async () => { 
       await server.close(); 
       await Blender.remove({});
    });

   describe('GET /', () => {
     it('should return all blenders', async () => {
       await Blender.collection.insertMany([
         { name: 'blender1' },
         { name: 'blender2' },  
       ]);

      const res = await request(server).get('/api/blenders');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(b => b.name === 'blender1')).toBeTruthy();
      expect(res.body.some(b => b.name === 'blender2')).toBeTruthy();

     });
   });

   describe('GET /:id', () => {
     it('should return a blender if valid id is passed', async () => {
        const blender = new Blender({ name: 'blender1' });
        await blender.save();

        const res = await request(server).get('/api/blenders' + blender._id);
       
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', blender.name);
     });
     it('should return 404 if invalid id is passed', async () => {

      const res = await request(server).get('/api/blenders/1');
     
      expect(res.status).toBe(404);
   });
   it('should return 404 if no blender with the given id exists', async () => {
     const id = mongoose.Types.ObjectId();
     const res = await request(server).get('/api/blenders' + id);

     expect(res.status).toBe(404);
   });
   });

   describe('POST /', () => {
     let token;
     let name;

     const exec = async () => {
      return  await request(server)
      .post('/api/blenders')
      .set('x-auth-token', token)
      .send({ name });
     }

     beforeEach(() => {
       token = new User().generateAuthToken();
       name = 'blender1';
     })

    it('should return 401 if client is not logged in', async () => {
       token = '';
       
       const res = await exec();

       expect(res.status).toBe(401);
    });
    it('should return 400 if blender is less than 5 characters', async () => {
         name = '1234';
      
         const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 400 if blender is more than 50 characters', async () => {
       name = new Array(52).join('a');

        const res = await exec();

       expect(res.status).toBe(400);
    });
    it('should save the blender if it is valid', async () => {

       await exec();
   
       const blender = await Blender.find({ name: 'blender1' });

       expect(blender).not.toBeNull();
    });
    it('should return the blender if it is valid', async () => {
        const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'blender1');
    });
  });
});