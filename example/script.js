// Load modules

var Fireworks = require('../');
var C = Fireworks.color;


var whiteBurst = [
    {
        type: 'launch',
        colors: [C.white, 0, 0],
        size: 3,
        blanks: 15,
        audio: 'launch'
    },
    {
        type: 'overlay',
        offset: 'end',
        first: {
            type: 'burst',
            color: C.white,
            size: 2,
            audio: 'burst'
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
        blanks: 15,
        audio: 'launch'
    },
    {
        type: 'stars',
        location: 'inner',
        size: 10,
        color: C.red,
        audio: 'sparkle'
    },
    {
        type: 'stars',
        location: 'outter',
        size: 10,
        color: C.red,
        audio: 'sparkle'
    }
];


var blueCircles = [
    {
        type: 'launch',
        colors: [0, 0, C.blue],
        size: 5,
        blanks: 40,
        audio: 'launch'
    },
    {
        type: 'curve',
        duration: 30,
        color: C.blue,
        audio: 'burst'
    }
];


var fireStorm = [
    {
        type: 'launch',
        colors: [C.red, C.yellow, C.orange],
        sizes: [3, 6, 9],
        audio: 'launch'
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
                sizes: [3, 4, 5],
                audio: 'burst'
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
            colors: [C.yellow, 0, 0],
            audio: 'sparkle'
        }
    },
    {
        type: 'stars',
        location: 'inner',
        size: 8,
        colors: [C.red, C.yellow, C.orange],
        audio: 'sparkle'
    },
    {
        type: 'stars',
        location: 'outter',
        size: 12,
        colors: [C.red, C.yellow, C.orange],
        audio: 'sparkle'
    }
];


var stars = function (color, size, curve) {

    var set = [];
    var count = (curve === 'inner' ? 6 : 12);
    for (var i = 0; i < count; ++i) {
        var colors = count === 6 ? [0, 0, 0, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        colors[i] = color;

        var star = {
            type: 'stars',
            location: curve,
            size: size,
            colors: colors
        };

        if (!i) {
            star.audio = 'sparkle';
        }

        set.push(star);
    }

    return set;
};


var forest = [
    {
        type: 'launch',
        colors: [C.green, C.darkgreen, C.olive],
        size: 4,
        blanks: 20,
        audio: 'launch'
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
