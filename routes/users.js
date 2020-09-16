const express = require('express');
const users = require('../data/users.json');
const { authenticateToken } = require('../utils/utils');

const usersRoutes = express.Router();

// As mock data, all changes to users will be only on the opened server session
usersRoutes.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.sendStatus(400);
  if (users.find((user) => user.email === email)) return res.sendStatus(409);
  users.push({ name, email, password });
  return res.sendStatus(201);
});

usersRoutes.post('/updateUserPassword', authenticateToken, (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.sendStatus(400);
  const userIndex = users.findIndex((userObj) => userObj.email === email);
  if (userIndex < 0) return res.sendStatus(404);
  users[userIndex].password = newPassword;
  return res.sendStatus(200);
});

usersRoutes.post('/resetUserPassword', (req, res) => {
  const { email } = req.body;
  if (!email) return res.sendStatus(400);
  const userIndex = users.findIndex((userObj) => userObj.email === email);
  if (userIndex < 0) return res.sendStatus(404);
  const resetPassword = Math.random().toString(36).slice(-8);
  // As mock data, password is reset here, otherwise should send an email with the new password
  users[userIndex].password = resetPassword;
  return res.sendStatus(200);
});

usersRoutes.delete('/deleteUser', authenticateToken, (req, res) => {
  const { email } = req.body;
  if (!email) return res.sendStatus(400);
  const userIndex = users.findIndex((userObj) => userObj.email === email);
  if (userIndex < 0) return res.sendStatus(404);
  users.splice(userIndex, 1);
  return res.sendStatus(200);
});

module.exports = usersRoutes;
