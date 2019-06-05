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
 const PORT = process.env.PORT || 8080;

// Start the app by listening on the default Heroku port
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = new SocketServer({ app });

io.on('connection', (socket) => {
  console.log('user connect');
socket.on('NovoRetorno', (dados) => { io.emit('NovoRetorno', dados); });

socket.on('NovaObservacao', (dados) => { io.emit('NovaObservacao', dados); });

socket.on('NotificacaoUsuarioRetorno', (dados) => { io.emit('NotificacaoUsuarioRetorno', dados); });

socket.on('StatusRetornoAlterado', (dados) => { io.emit('StatusRetornoAlterado', dados); });
});


