// Load modules

var Hoek = require('hoek');


// Declare internals

var internals = {};

internals.colors = {
    green: '00ff0f',
    blue: '0000ff',
    red: 'ff0000',
    yellow: 'ffff00',
    magenta: 'ff00ff',
    white: 'ffffff',
    black: '000000'
};


exports.compile = function () {

    var black = 0;
    var white = parseInt('ffffff', 16);

    // Frames

    var f1 = [black, black, black];             // led0, led1, led2
    var f2 = [white, black, black];
    var f3 = [black, white, black];
    var f4 = [black, black, white];
    var f5 = [black, black, black];

    // Single strand sequence

    var sequence = [f1, f2, f3, f4, f5];        // tick0, tick1, tick2

    // Set

    var set = [sequence, sequence, sequence];   // strand0, strand1, strand2

    return set;
};


console.log(exports.compile());