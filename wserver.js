/*
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
*/
//Install express server
const express = require('express');
const path = require('path');
const app = express();
const SocketServer = require('https').Server;

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/VirtualWeb-App'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/VirtualWeb-App/index.html'));
});

const PORT1 = process.env.PORT || 3000;

// Start the app by listening on the default Heroku port
app.listen(PORT1, () => console.log(`Listening on ${ PORT1 }`));

const io = new SocketServer({ app });

io.on('connection', (socket) => {
    console.log('user connect');
  socket.on('NovoRetorno', (dados) => { io.emit('NovoRetorno', dados); });

  socket.on('NovaObservacao', (dados) => { io.emit('NovaObservacao', dados); });

  socket.on('NotificacaoUsuarioRetorno', (dados) => { io.emit('NotificacaoUsuarioRetorno', dados); });

  socket.on('StatusRetornoAlterado', (dados) => { io.emit('StatusRetornoAlterado', dados); });
});