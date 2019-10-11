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
  .use(express.static(__dirname + '/dist/VirtualWeb-App'))
  .get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/VirtualWeb-App/index.html'));
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

let io = socketIO(server);
 
io.on('connection', (socket) => {
    console.log('user connect');

    socket.on('NovoRetorno', (dados) => { io.emit('NovoRetorno', dados); });

    socket.on('NovaObservacao', (dados) => { io.emit('NovaObservacao', dados); });

    socket.on('NotificacaoUsuarioRetorno', (dados) => { io.emit('NotificacaoUsuarioRetorno', dados); });
    
    socket.on('AutorizacaoVendaGerarPedido', (dados) => { io.emit('AutorizacaoVendaGerarPedido', dados); });
 
    socket.on('RespAutorizacaoVendaGerarPedido', (dados) => { io.emit('RespAutorizacaoVendaGerarPedido', dados); });

    socket.on('StatusRetornoAlterado', (dados) => { io.emit('StatusRetornoAlterado', dados); });
});