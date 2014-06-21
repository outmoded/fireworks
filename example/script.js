// Load modules

var Fireworks = require('../');
var C = Fireworks.color;


// Declare internals

var internals = {};


internals.set = [
    {
        type: 'launch',
        colors: [C.red, C.yellow, C.orange],
        sizes: [3, 6, 9]
    },
    {
        type: 'overlay',
        offset: 23,
        first: {
            type: 'overlay',
            offset: 'end',
            first: {
                type: 'burst',
                colors: [C.red, C.yellow, C.orange],
                sizes: [3, 4, 5]
            },
            second: {
                type: 'tails',
                colors: [C.red, C.yellow, C.orange],
                sizes: [3, 3, 3]
            }
        },
        second: {
            type: 'curve',
            duration: 30,
            colors: [C.yellow, 0, 0]
        }
    },
    {
        type: 'stars',
        location: 'inner',
        size: 8,
        colors: [C.red, C.yellow, C.orange]
    },
    {
        type: 'curve',
        duration: 30,
        colors: [0, C.white, C.white]
    },
    {
        type: 'stars',
        location: 'outter',
        size: 12,
        colors: [C.red, C.yellow, C.orange]
    },
    {
        type: 'sparkle',
        duration: 20,
        color: C.gray
    }
];


internals.instructions = {
    type: 'overlay',
    offset: 45,
    first: internals.set,
    second: internals.set
};


exports.animation = 'var animation = ' + JSON.stringify(Fireworks.compile(internals.instructions)) + ';';
