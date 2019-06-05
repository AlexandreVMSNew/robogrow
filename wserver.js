
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 3000;

const INDEX = path.join(__dirname + '/dist/VirtualWeb-App/index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

let io = socketIO(server);

io.on('connection', (socket) => {
    console.log('user connect');
    socket.on('NovoRetorno', (dados) => { io.emit('NovoRetorno', dados); });

    socket.on('NovaObservacao', (dados) => { io.emit('NovaObservacao', dados); });

    socket.on('NotificacaoUsuarioRetorno', (dados) => { io.emit('NotificacaoUsuarioRetorno', dados); });

    socket.on('StatusRetornoAlterado', (dados) => { io.emit('StatusRetornoAlterado', dados); });
});
