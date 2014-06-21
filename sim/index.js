// Load modules

var Hapi = require('hapi');
var Hoek = require('hoek');


// Declare internals

var internals = {};


var server = new Hapi.Server(8000);
server.route({ method: 'GET', path: '/{p*}', handler: { directory: { path: __dirname + '/static' } } });
server.start(function (err) {

    Hoek.assert(!err);

    console.log('Started at: ' + server.info.uri);
});