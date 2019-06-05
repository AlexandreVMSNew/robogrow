//Install express server
const express = require('express');
const path = require('path');

const app = express();

let http = require('ws').Server;
let server = http.Server(app);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/VirtualWeb-App'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/VirtualWeb-App/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);


let socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = new SocketServer({ server });

io.on('connection', (socket) => {

    socket.on('NovoRetorno', (dados) => { io.emit('NovoRetorno', dados); });

    socket.on('NovaObservacao', (dados) => { io.emit('NovaObservacao', dados); });

    socket.on('NotificacaoUsuarioRetorno', (dados) => { io.emit('NotificacaoUsuarioRetorno', dados); });

    socket.on('StatusRetornoAlterado', (dados) => { io.emit('StatusRetornoAlterado', dados); });
});

server.listen(port, () => {

});
