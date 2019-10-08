const express = require('express');
const socketIO = require('socket.io');
var sslRedirect = require('heroku-ssl-redirect');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(sslRedirect());
const server = express()
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