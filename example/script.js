// Load modules

var Fireworks = require('../');
var C = Fireworks.color;


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


var fireStorm = [
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
        type: 'stars',
        location: 'outter',
        size: 12,
        colors: [C.red, C.yellow, C.orange]
    }
];


var stars = function (color, size, curve) {

    var set = [];
    var count = (curve === 'inner' ? 6 : 12);
    for (var i = 0; i < count; ++i) {
        var colors = count === 6 ? [0, 0, 0, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        colors[i] = color;
        set.push({
            type: 'stars',
            location: curve,
            size: size,
            colors: colors
        });
    }

    return set;
};


var forest = [
    {
        type: 'launch',
        colors: [C.green, C.darkgreen, C.olive],
        size: 4,
        blanks: 20
    },
    {
        type: 'timeline',
        sets: [
            [0, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.green, 10, 'outter')
            }],
            [0, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.green, 10, 'inner')
            }],
            [5, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.darkgreen, 10, 'outter')
            }],
            [5, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.darkgreen, 10, 'inner')
            }],
            [10, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.olive, 10, 'outter')
            }],
            [10, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.olive, 10, 'inner')
            }]
        ]
    }
];


var instructions = {
    type: 'timeline',
    sets: [
        [0, whiteBurst],
        [5, blueCircles],
        [10, whiteBurst],
        [15, redStars],
        [10, whiteBurst],
        [15, redStars],
        [130, fireStorm],
        [130, forest]
    ]
};


exports.animation = 'var animation = ' + JSON.stringify(Fireworks.compile(instructions)) + ';';
