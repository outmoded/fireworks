// Load modules

var Path = require('path');
var Hapi = require('hapi');
var Hoek = require('hoek');
var Script = require('./script.js');


// Declare internals

var internals = {};


var server = new Hapi.Server(8000);
server.route({ method: 'GET', path: '/{p*}', handler: { directory: { path: __dirname + '/static' } } });
server.route({ method: 'GET', path: '/audio/{p*}', handler: { directory: { path: Path.join(__dirname, '../sounds') } } });
server.route({ method: 'GET', path: '/data.js', handler: function (request, reply) { reply('var animation = ' + JSON.stringify(Script.animation) + ';').type('application/javascript'); } });

server.start(function (err) {

    Hoek.assert(!err);

    console.log('Started at: ' + server.info.uri);
});