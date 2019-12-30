const winston = require('winston');
const express = require('express');

// Start express app
const app = express();

require('../fitness-blender/startup/logging')();
require('../fitness-blender/startup/routes')(app);
require('../fitness-blender/startup/db')();
require('../fitness-blender/startup/config')();
require('../fitness-blender/startup/validation')();
require('../fitness-blender/startup/prod')(app);

//const p = Promise.reject(new Error('Something failed miserably!'));
//p.then(() => console.log('Done'));

app.get('/', (req, res) => {
   res.send('Fitness Server');
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;