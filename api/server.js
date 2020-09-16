const express = require('express');
const logRoutes = require('../routes/log');
const usersRoutes = require('../routes/users');
const { specificRequest } = require('../utils/utils');
const { API_MAIN_ROUTE } = require('../utils/utils');

const server = express();
server.use(express.json());

server.use(API_MAIN_ROUTE, logRoutes);
server.use(API_MAIN_ROUTE, usersRoutes);

specificRequest(server, `${API_MAIN_ROUTE}/users`);
specificRequest(server, `${API_MAIN_ROUTE}/data`);
specificRequest(server, `${API_MAIN_ROUTE}/dataId`);

module.exports = server;
