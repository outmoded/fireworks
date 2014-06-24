// Load modules

var Fireworks = require('../');
var C = Fireworks.color;


var simpleBurst = function (color, strand, stretch) {

    var colors = [0, 0, 0];
    colors[strand] = color;

    return [
        {
            type: 'launch',
            colors: colors,
            size: 10,
            audio: 'launch'
        },
        {
            type: 'burst',
            color: color,
            size: 15,
            audio: 'burst',
            stretch: stretch
        }
    ];
};


var simpleTails = function (color, strand, stretch) {

    var colors = [0, 0, 0];
    colors[strand] = color;

    return [
        {
            type: 'launch',
            colors: colors,
            size: 10,
            audio: 'launch',
            blanks: 10
        },
        {
            type: 'tails',
            color: color,
            size: 15,
            audio: 'burst',
            stretch: stretch
        }
    ];
};


var simpleCurve = function (color, location, strand) {

    var colors = [0, 0, 0];
    colors[strand] = color;

    return [
        {
            type: 'launch',
            colors: colors,
            size: 15,
            audio: 'launch'
        },
        {
            type: 'curve',
            duration: 40,
            colors: location === 'inner' ? [color, 0, 0] : [0, color, color],
            audio: 'sparkle'
        }
    ];
};


var whiteBurst = [
    {
        type: 'launch',
        colors: [C.white, 0, 0],
        size: 10,
        blanks: 15,
        audio: 'launch'
    },
    {
        type: 'overlay',
        offset: 'end',
        first: {
            type: 'burst',
            color: C.white,
            size: 5,
            audio: 'burst'
        },
        second: {
            type: 'tails',
            color: C.white,
            size: 5
        }
    }
];


var redStars = [
    {
        type: 'launch',
        colors: [0, C.red, 0],
        size: 10,
        blanks: 15,
        audio: 'launch'
    },
    {
        type: 'stars',
        location: 'inner',
        size: 8,
        color: C.red,
        audio: 'sparkle'
    },
    {
        type: 'stars',
        location: 'outter',
        size: 8,
        color: C.red,
        audio: 'sparkle'
    }
];


var blueCircles = [
    {
        type: 'launch',
        colors: [0, 0, C.blue],
        size: 10,
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
        size: 10,
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
                size: 15,
                audio: 'burst'
            },
            second: {
                type: 'tails',
                colors: [C.red, C.yellow, C.orange],
                sizes: [8, 8, 8]
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
        size: 8,
        colors: [C.red, C.yellow, C.orange],
        audio: 'burst'
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
        colors: [C.green, C.lightgreen, C.olive],
        size: 10,
        audio: 'launch'
    },
    {
        type: 'burst',
        color: C.green,
        size: 5,
        slice: [5, 15],
        audio: 'burst'
    },
    {
        type: 'timeline',
        sets: [
            [0, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.green, 7, 'outter')
            }],
            [0, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.green, 7, 'inner')
            }],
            [5, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.lightgreen, 7, 'outter')
            }],
            [5, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.lightgreen, 7, 'inner')
            }],
            [10, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.olive, 7, 'outter')
            }],
            [10, {
                type: 'random',
                duration: 15,
                offset: 8,
                sets: stars(C.olive, 7, 'inner')
            }]
        ]
    }
];


var rainbow = [
    {
        type: 'launch',
        colors: [0, [C.purple, C.blue, C.green, C.yellow, C.orange, C.red], 0],
        size: 6,
        audio: 'launch',
        blanks: 5
    },
    {
        type: 'timeline',
        sets: [
            [0, {
                type: 'stars',
                location: 'outter',
                size: 8,
                color: [C.purple, C.blue, C.green, C.yellow, C.orange, C.red],
                audio: 'burst',
                stretch: 2
            }],
            [0, {
                type: 'stars',
                location: 'inner',
                size: 8,
                color: [C.purple, C.blue, C.green, C.yellow, C.orange, C.red],
                stretch: 2
            }]
        ]
    }
];


var whirl = [
    {
        type: 'whirl',
        color: C.white,
        size: 20,
        audio: 'whirl'
    },
    {
        type: 'timeline',
        sets: [
            [0, {
                type: 'burst',
                color: C.white,
                size: 20,
                audio: 'burst'
            }],
            [5, {
                type: 'spin',
                color: C.white,
                size: 15,
                audio: 'burst'
            }],
            [10, {
                type: 'tails',
                color: C.white,
                size: 20,
                stretch: 2
            }],
            [10, {
                type: 'burst',
                color: C.white,
                size: 20,
                audio: 'burst'
            }],
            [10, {
                type: 'tails',
                color: C.white,
                size: 20,
                stretch: 2
            }]
        ]
    }
];


var instructions = {
    type: 'timeline',
    sets: [
        [50, whirl],
        [100, simpleBurst(C.purple, 0)],
        [15, simpleTails(C.pink, 2, 3)],
        [15, simpleBurst(C.pink, 1)],
        [70, simpleCurve(C.yellow, 'inner', 0)],
        [15, simpleCurve(C.orange, 'outter', 2)],
        [50, whiteBurst],
        [15, blueCircles],
        [10, whiteBurst],
        [15, redStars],
        [10, whiteBurst],
        [15, redStars],
        [130, fireStorm],
        [130, forest],
        [200, rainbow]
    ]
};


exports.animation = 'var animation = ' + JSON.stringify(Fireworks.compile(instructions)) + ';';
