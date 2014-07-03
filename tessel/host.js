var Fs = require('fs');
var Path = require('path');
var Lame = require('lame');
var Speaker = require('speaker');
var Tessel = require('tessel');
var Fireworks = require('../');
var Script = require(process.argv[2]);


var internals = {};

internals.deviceFile = '/device.js';


internals.play = function () {

    internals.device();

    console.log('Connecting to Tessel...');
    Tessel.findTessel(null, true, function (err, client) {

        if (err) {
            throw err;
        }

        client.run(__dirname + internals.deviceFile, ['tessel', internals.deviceFile], { single: true }, function () {

            client.stdout.resume();
            client.stdout.pipe(process.stdout);
            client.stderr.resume();
            client.stderr.pipe(process.stderr);
            console.info('Running device script...');

            client.interface.writeProcessMessage({ type: 'animation' });
            client.once('message', function (msg) {

                internals.sound('burst');
                console.log('MESSAGE:' + msg);
            });

            // Stop on Ctrl+C

            process.on('SIGINT', function() {

                setTimeout(function () {

                    console.log('Script aborted');
                    process.exit();
                }, 200);

                client.stop();
            });

            client.once('script-stop', function (code) {

                client.close(function () {

                    process.exit(code);
                });
            });
        });
    });
};


internals.sound = function (name) {

    var file = Path.join(__dirname, '../sounds', name + '.mp3');

    var readable = Fs.createReadStream(file);
    var decoder = new Lame.Decoder();
    var speaker = new Speaker();
    readable.pipe(decoder).pipe(speaker);
};


internals.device = function () {

    var play = function () {

        var tessel = process.binding('hw');

        process.on('message', function (msg) {

            if (msg.type === 'animation') {
                console.log('Playing...');
                var now = Date.now();
                tessel.neopixel_animation_buffer(pixels);
                process.once('neopixel_animation_complete', function () {

                    var duration = Date.now() - now;
                    console.log('Animation: end' + ' (' + Math.floor(duration) + 'ms, ' + Math.floor(pixels.length / duration * 1000) + 'fps)');
                    process.send('done');
                });
            }
        });

        process.ref();
    };

    console.log('Writing device file...');
    var file = Fs.createWriteStream(__dirname + internals.deviceFile);
    var pixels = internals.neopixels();
    file.write('var pixels = ' + JSON.stringify(pixels) + ';\n');
    file.write('var play = ' + play.toString() + ';\n');
    file.write('play();\n');
    file.end();
};


internals.neopixels = function () {

    var animation = Script.animation;

    var array = [];
    var segments = ['launcher', 'burst1', 'burst2', 'tail1', 'tail2', 'curve'];

    for (var f = 0, fl = animation[0].length; f < fl; ++f) {
        var neoFrame = new Buffer(Fireworks.pos.strands.length * Fireworks.pos.strands.count * 3);
        neoFrame.fill(0);

        var pos = 0;

        for (var g = 0, gl = segments.length; g < gl; ++g) {
            var segment = Fireworks.pos.mark[segments[g]];
            var start = segment[0];
            var end = segment[1] + 1;
            var length = end - start;

            for (var s = 0; s < Fireworks.pos.strands.count; ++s) {
                var strand = animation[s];
                var frame = strand[f];

                for (var p = start; p < end; ++p) {
                    var pixel = frame[p];
                    var rgb = [(pixel & (255 << 16)) >> 16, (pixel & (255 << 8)) >> 8, pixel & 255];
                    neoFrame[pos] = rgb[1];
                    neoFrame[pos + 1] = rgb[0];
                    neoFrame[pos + 2] = rgb[2];
                    pos += 3;
                }
            }
        }

        array.push(neoFrame.toString('binary'));
    }

    return array;
};


internals.play();