//Install express sersver
const express = require('express');
const path = require('path');
const app = express();
var sslRedirect = require('heroku-ssl-redirect');

app.use(sslRedirect());
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/VirtualWeb-App'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/VirtualWeb-App/index.html'));
});
 
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

