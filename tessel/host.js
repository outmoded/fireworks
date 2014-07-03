// Load modules

var Fs = require('fs');
var Path = require('path');
var Lame = require('lame');
var Speaker = require('speaker');
var Tessel = require('tessel');
var Fireworks = require('../');
var Script = require(process.argv[2]);


// Declare internals

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

            client.interface.writeProcessMessage({ type: 'play' });
            client.on('message', function (msg) {

                if (msg.type === 'done') {
                    console.log('Finished')
                }

                if (msg.type === 'audio') {
                    console.log('Audio: ' + msg.sound);
                    internals.sound(msg.sound);
                }
            });

            // Stop on Ctrl+C

            process.on('SIGINT', function() {

                console.log('Script aborted');
                setTimeout(function () {

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

        var pos = 0;
        var next = function () {

            if (pos === array.length) {
                pos = 0;
            }

            var sequence = array[pos];
            console.log('Sequence: ' + pos + ' (' + sequence.type + ')');

            pos++

            // Audio

            if (sequence.type === 'audio') {
                process.send(sequence);
                return next();
            }

            // Animation

            var now = Date.now();
            tessel.neopixel_animation_buffer(sequence.pixels);
            process.once('neopixel_animation_complete', function () {

                var duration = Date.now() - now;
                console.log('Stats: ' + Math.floor(duration) + 'ms, ' + Math.floor(sequence.pixels.length / duration * 1000) + 'fps');
                return next();
            });
        };

        process.on('message', function (msg) {

            if (msg.type === 'play') {
                console.log('Playing...');
                next();
            }
        });

        process.ref();
    };

    console.log('Writing device file...');
    var file = Fs.createWriteStream(__dirname + internals.deviceFile);
    var pixels = internals.neopixels();
    file.write('var array = ' + JSON.stringify(pixels) + ';\n');
    file.write('var play = ' + play.toString() + ';\n');
    file.write('play();\n');
    file.end();
};


internals.neopixels = function () {

    var animation = Script.animation;

    var array = [];
    var sequence = [];

    var segments = ['launcher', 'burst1', 'burst2', 'tail1', 'tail2', 'curve'];

    for (var f = 0, fl = animation[0].length; f < fl; ++f) {
        var sound = animation[3][f];
        if (sound) {
            if (sequence.length) {
                array.push({ type: 'animation', pixels: sequence });
                sequence = [];
            }

            array.push({ type: 'audio', sound: sound });
        }

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

        sequence.push(neoFrame.toString('binary'));
    }

    if (sequence.length) {
        array.push({ type: 'animation', pixels: sequence });
    }

    return array;
};


internals.play();