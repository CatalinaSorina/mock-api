const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../data/users.json');

const logRoutes = express.Router();

const generateToken = (user, refresh) => (refresh
  ? jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  : jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' }));

let refreshTokens = [];

logRoutes.post('/refreshToken', (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateToken(user, true);
    return res.json({ accessToken });
  });
});

logRoutes.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  const user = users.find((userObj) => userObj.email === email);
  if (!user) return res.sendStatus(401);
  if (user.password !== password) return res.sendStatus(403);
  const accessToken = generateToken(user, false);
  const refreshToken = generateToken(user, true);
  refreshTokens.push(refreshToken);
  return res.json({ accessToken, refreshToken });
});

logRoutes.delete('/logout', (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(400);
  if (!refreshTokens.includes(token)) return res.sendStatus(404);
  refreshTokens = refreshTokens.filter((refreshToken) => refreshToken !== token);
  return res.sendStatus(204);
});

logRoutes.get('/tokens', (req, res) => res.json(refreshTokens));

module.exports = logRoutes;
