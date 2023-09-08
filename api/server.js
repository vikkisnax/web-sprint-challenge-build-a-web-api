// importing a CommonJS module
const express = require('express');
const server = express();

//Global MW - Configure your server here -- remember express by default cannot parse JSON in request bodies, so use this code 
server.use(express.json());

//middleware - to run it every time - like a timestamp
const { logger } = require ('./actions/actions-middlware');

// so we can use it in the app - runs everytime 
server.use(logger);

// routers - for the endpoints below
const actionsRouter = require ('./actions/actions-router');
const projectsRouter = require ('./projects/projects-router');

//ENDPOINTS - write in their own files -- w/e route/endpoint starts with this will go to there 
server.use('/api/actions', actionsRouter);
server.use('/api/projects', projectsRouter);

//dummy test endpoint - http :9000
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});


// Do NOT `server.listen()` inside this file!

module.exports = server;