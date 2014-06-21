// Load modules

var Hapi = require('hapi');


// Declare internals

var internals = {};


var server = new Hapi.Server(8000);
server.route({ method: 'GET', path: '/{p*}', handler: { directory: { path: './static' } } });
server.start();