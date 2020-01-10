const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();

var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

app.use(forceSsl);

const server = app
  .use(express.static(__dirname + '/dist/RoboGrow-App'))
  .get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/RoboGrow-App/index.html'));
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

let io = socketIO(server);
 
io.on('connection', (socket) => {
    console.log('Usuário Conectado!');

    socket.on('teste', (dados) => { io.emit('teste', dados); });
    
});