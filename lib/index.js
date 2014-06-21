var Colors = require('./colors');


var strands = {
    count: 3,
    length: 420
};


var positions = {
    launcher: [0, 89],
    burst1: [90, 149],
    burst2: [150, 209],
    tail1: [210, 239],
    tail2: [240, 269],
    circle: [270, 419],
    star: {
        inner: [
            [
                [0, 270, 1],
                [0, 419, -1],
                [0, 113, -1],
                [0, 114, 1]
            ],
            [
                [0, 295, 1],
                [0, 294, -1],
                [2, 174, -1],
                [2, 175, 1]
            ],
            [
                [0, 320, 1],
                [0, 319, -1],
                [2, 113, -1],
                [2, 114, 1]
            ],
            [
                [0, 345, 1],
                [0, 344, -1],
                [1, 174, -1],
                [1, 175, 1]
            ],
            [
                [0, 370, 1],
                [0, 369, -1],
                [1, 113, -1],
                [1, 114, 1]
            ],
            [
                [0, 395, 1],
                [0, 394, -1],
                [0, 174, -1],
                [0, 175, 1]
            ],
        ],
        outter: [
            [
                [2, 270, 1],
                [1, 419, -1],
                [0, 137, -1],
                [0, 136, 1]
            ],
            [
                [2, 295, 1],
                [2, 294, -1],
                [2, 227, -1],
                [2, 226, 1]
            ],
            [
                [2, 320, 1],
                [2, 319, -1],
                [2, 197, -1],
                [2, 196, 1]
            ],
            [
                [2, 345, 1],
                [2, 344, -1],
                [2, 257, -1],
                [2, 256, 1]
            ],
            [
                [2, 370, 1],
                [2, 369, -1],
                [2, 137, -1],
                [2, 136, 1]
            ],
            [
                [2, 395, 1],
                [2, 394, -1],
                [1, 227, -1],
                [1, 226, 1]
            ],
            [
                [2, 419, -1],
                [1, 270, 1],
                [1, 197, -1],
                [1, 196, 1]
            ],
            [
                [1, 295, 1],
                [1, 294, -1],
                [1, 257, -1],
                [1, 256, 1]
            ],
            [
                [1, 320, 1],
                [1, 319, -1],
                [1, 137, -1],
                [1, 136, 1]
            ],
            [
                [1, 345, 1],
                [1, 344, -1],
                [0, 227, -1],
                [0, 226, 1]
            ],
            [
                [1, 370, 1],
                [1, 369, -1],
                [0, 197, -1],
                [0, 196, 1]
            ],
            [
                [1, 395, 1],
                [1, 394, -1],
                [0, 257, -1],
                [0, 256, 1]
            ],
        ]
    }
};


/*
    var frame1 = [black, black, black];                             // led0, led1, led2
    var frame2 = [white, black, black];
    var frame3 = [black, white, black];
    var frame4 = [black, black, white];
    var frame5 = [black, black, black];

    var sequence = [frame1, frame2, frame3, frame4, frame5];        // tick0, tick1, tick2
    var animation = [sequence, sequence, sequence];                 // strand0, strand1, strand2
*/


var compile = function () {

    var inner = innerStars(Colors.white, 5);
    var outter = outterStars(Colors.white, 5);

    var animation = [
        [].concat(launch(Colors.blue, 6), combine(combine(burst(Colors.blue, 6), tails(Colors.blue, 3), 'end'), circle(Colors.blue, 30), 23), inner[0], filler(30), outter[0]),
        [].concat(launch(Colors.cyan, 3), combine(burst(Colors.cyan, 3), tails(Colors.cyan, 3), 'end'), inner[1], circle(Colors.cyan, 30), outter[1]),
        [].concat(launch(Colors.aqua, 9), combine(burst(Colors.aqua, 9), tails(Colors.aqua, 3), 'end'), inner[2], circle(Colors.aqua, 30), outter[2])
    ];

    return animation;
};


var blank = function () {

    var blank = new Array(strands.length);
    for (var i = 0; i < strands.length; ++i) {
        blank[i] = 0;
    }

    return blank;
};


var filler = function (duration) {

    var blanks = [];
    for (var i = 0; i < duration; ++i) {
        blanks.push(blank());
    }

    return blanks;
};


var combine = function (seq1, seq2, offset) {

    offset = offset || 0;
    if (offset === 'end') {
        offset = seq1.length - seq2.length;
    }

    if (offset < 0) {
        offset *= -1;
        var holder = seq1;
        seq1 = seq2;
        seq2 = holder;
    }

    var size = Math.max(seq1.length, seq2.length + offset);
    var combo = new Array(size);

    for (var i = 0; i < size; ++i) {
        if (i < offset) {
            combo[i] = seq1[i];
        }
        else {
            var frame = blank();
            for (var s = 0; s < strands.length; ++s) {
                frame[s] = (seq1[i] && seq1[i][s]) || (seq2[i - offset] && seq2[i - offset][s]) || 0;
            }

            combo[i] = frame;
        }
    }

    return combo;
};


var launch = function (color, size) {

    var start = positions.launcher[0];
    var end = positions.launcher[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
        }

        sequence.push(frame);
    }

    return sequence;
};


var burst = function (color, size) {

    var start = positions.burst1[0];
    var offset = positions.burst2[0] - start;
    var end = positions.burst1[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
            frame[i + s + offset] = color;
        }

        sequence.push(frame);
    }

    return sequence;
};


var tails = function (color, size) {

    var start = positions.tail1[0];
    var offset = positions.tail2[0] - start;
    var end = positions.tail1[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
            frame[i + s + offset] = color;
        }

        sequence.push(frame);
    }

    return sequence;
};


var circle = function (color, duration) {

    var start = positions.circle[0];
    var end = positions.circle[1];

    var sequence = [];
    for (var i = 0; i < duration; ++i) {
        var frame = blank();
        for (var s = start; s <= end; ++s) {
            frame[s] = Math.random() > 0.9 ? color : 0;
        }

        sequence.push(frame);
    }

    return sequence;
};


var sparkle = function (color, duration) {

    var start = positions.burst1[0];
    var end = positions.circle[1];

    var sequence = [];
    for (var i = 0; i < duration; ++i) {
        var frame = blank();
        for (var s = start; s <= end; ++s) {
            frame[s] = Math.random() > 0.9 ? color : 0;
        }

        sequence.push(frame);
    }

    return sequence;
};


var star = function (color, size, circle, id) {

    var sequences = [[], [], []];
    var pos = positions.star[circle][id];

    var draw = function (color) {

        for (var i = 0; i < size; ++i) {
            var frames = [blank(), blank(), blank()];
            for (var l = 0; l < 4; ++l) {
                var line = pos[l];

                var strand = line[0];
                var led = line[1];
                var direction = line[2];

                frames[strand][led + (i * direction)] = color;
            }

            for (var s = 0; s < 3; ++s) {
                sequences[s].push(frames[s]);
            }
        }
    };

    draw(color);
    draw(0);

    return sequences;
};


var innerStars = function (color, size) {

    var sequences = star(color, size, 'inner', 0);

    for (var i = 1; i < 6; ++i) {
        var seq = star(color, size, 'inner', i);
        for (var s = 0; s < 3; ++s) {
            sequences[s] = combine(sequences[s], seq[s]);
        }
    }

    return sequences;
};


var outterStars = function (color, size) {

    var sequences = star(color, size, 'outter', 0);

    for (var i = 1; i < 12; ++i) {
        var seq = star(color, size, 'outter', i);
        for (var s = 0; s < 3; ++s) {
            sequences[s] = combine(sequences[s], seq[s]);
        }
    }

    return sequences;
};


console.log('var animation = ' + JSON.stringify(compile()) + ';');
