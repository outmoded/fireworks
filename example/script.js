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


var whiteBurst = [
    {
        type: 'launch',
        colors: [C.white, 0, 0],
        size: 3,
        blanks: 15
    },
    {
        type: 'overlay',
        offset: 'end',
        first: {
            type: 'burst',
            color: C.white,
            size: 2
        },
        second: {
            type: 'tails',
            color: C.white,
            size: 1
        }
    }
];


var redStars = [
    {
        type: 'launch',
        colors: [0, C.red, 0],
        size: 5,
        blanks: 15
    },
    {
        type: 'stars',
        location: 'inner',
        size: 10,
        color: C.red
    },
    {
        type: 'stars',
        location: 'outter',
        size: 10,
        color: C.red
    }
];


var blueCircles = [
    {
        type: 'launch',
        colors: [0, 0, C.blue],
        size: 5,
        blanks: 40
    },
    {
        type: 'curve',
        duration: 30,
        color: C.blue
    }
];


internals.instructions = {
    type: 'timeline',
    sets: [
        [0, whiteBurst],
        [5, blueCircles],
        [10, whiteBurst],
        [15, redStars],
        [10, whiteBurst],
        [15, redStars],
        [200, whiteBurst],
        [5, blueCircles],
        [10, whiteBurst],
        [15, redStars],
        [10, whiteBurst],
        [15, redStars]
    ]
};


exports.animation = 'var animation = ' + JSON.stringify(Fireworks.compile(internals.instructions)) + ';';
