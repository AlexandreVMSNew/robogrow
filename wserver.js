const express = require('express');
const app = express();
let http = require('https');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('user connect');
    socket.on('NovoRetorno', (dados) => { io.emit('NovoRetorno', dados); });

    socket.on('NovaObservacao', (dados) => { io.emit('NovaObservacao', dados); });

    socket.on('NotificacaoUsuarioRetorno', (dados) => { io.emit('NotificacaoUsuarioRetorno', dados); });

    socket.on('StatusRetornoAlterado', (dados) => { io.emit('StatusRetornoAlterado', dados); });
});

server.listen(port);
