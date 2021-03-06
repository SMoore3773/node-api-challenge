const express = require('express');
const helmet = require('helmet');
const projectRouter = require('./projectRouter');
const actionsRouter = require('./actionsRouter');
const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
    res.send(`<h2>web Node sprint challenge</h2>`);
  });



module.exports = server;