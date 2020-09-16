require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const server = require('./api/server');

const PORT = 8000;
const SECURE_PORT = 8040;

const options = {
  key: fs.readFileSync('./data/server.key'),
  cert: fs.readFileSync('./data/server.crt'),
};

const httpsServer = https.createServer(options, server);
httpsServer.listen(SECURE_PORT, () => {
  console.log(`Secure server running on port ${SECURE_PORT}`);
});

const httpServer = http.createServer(options, server);
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
