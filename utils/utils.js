const jwt = require('jsonwebtoken');
const users = require('../data/users.json');
const data = require('../data/data.json');

const API_MAIN_ROUTE = '/App';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    return next();
  });
};

const request = (server, method, url, dataToReceive) => server[method](url,
  (req, res) => res.json(dataToReceive));

const requestWithAuth = (server, method, url, dataToReceive) => server[method](url,
  authenticateToken,
  (req, res) => res.json(dataToReceive));

const specificRequest = (server, url) => {
  switch (url) {
    case `${API_MAIN_ROUTE}/users`:
      return server.get(url, (req, res) => res.json(users));
    case `${API_MAIN_ROUTE}/data`:
      return server.get(url, authenticateToken, (req, res) => res.json(
        data.filter((dataObj) => dataObj.name === req.user.name),
      ));
    case `${API_MAIN_ROUTE}/dataId`:
      return server.post(url, authenticateToken, (req, res) => {
        const { id } = req.body;
        if (!id) return res.sendStatus(400);
        if (!data.find((item) => item.id === id)) return res.sendStatus(404);
        return res.json(data.filter((item) => item.id === id));
      });
    default: return 'Sorry, not a defined route!';
  }
};

module.exports = {
  API_MAIN_ROUTE,
  authenticateToken,
  request,
  requestWithAuth,
  specificRequest,
};
