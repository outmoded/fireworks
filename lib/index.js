// Load modules

var Colors = require('./colors');


// Declare internals

var internals = {};


internals.positions = {
    launcher: [0, 89],
    burst1: [90, 149],
    burst2: [150, 209],
    tail1: [210, 239],
    tail2: [240, 269],
    circle: [270, 419]
};


internals.strands = {
    count: 3,
    length: 420
};


/*
    var frame1 = [black, black, black];                             // led0, led1, led2
    var frame2 = [white, black, black];
    var frame3 = [black, white, black];
    var frame4 = [black, black, white];
    var frame5 = [black, black, black];

    var sequence = [frame1, frame2, frame3, frame4, frame5];        // tick0, tick1, tick2
    var animaiton = [sequence, sequence, sequence];                 // strand0, strand1, strand2
*/


internals.compile = function () {

    var animation = [
        [].concat(internals.launch(Colors.blue, 6), exports.combine(internals.burst(Colors.blue, 6), internals.tails(Colors.blue, 3), 'end'), internals.sparkle(Colors.blue, 30)),
        [].concat(internals.launch(Colors.cyan, 3), exports.combine(internals.burst(Colors.cyan, 3), internals.tails(Colors.cyan, 3), 'end'), internals.sparkle(Colors.cyan, 30)),
        [].concat(internals.launch(Colors.aqua, 9), exports.combine(internals.burst(Colors.aqua, 9), internals.tails(Colors.aqua, 3), 'end'), internals.sparkle(Colors.aqua, 30))
    ];

    return animation;
};


internals.blank = function () {

    var blank = new Array(internals.strands.length);
    for (var i = 0; i < internals.strands.length; ++i) {
        blank[i] = 0;
    }

    return blank;
};


exports.combine = function (seq1, seq2, offset) {

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

    console.log(size)
    for (var i = 0; i < size; ++i) {
        if (i < offset) {
            combo[i] = seq1[i];
        }
        else {
            var frame = internals.blank();
            for (var s = 0; s < internals.strands.length; ++s) {
                frame[s] = seq1[i][s] || seq2[i - offset][s];
            }

            combo[i] = frame;
        }
    }

    return combo;
};


internals.launch = function (color, size) {

    var start = internals.positions.launcher[0];
    var end = internals.positions.launcher[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
        }

        sequence.push(frame);
    }

    return sequence;
};


internals.burst = function (color, size) {

    var start = internals.positions.burst1[0];
    var offset = internals.positions.burst2[0] - start;
    var end = internals.positions.burst1[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
            frame[i + s + offset] = color;
        }

        sequence.push(frame);
    }

    return sequence;
};


internals.tails = function (color, size) {

    var start = internals.positions.tail1[0];
    var offset = internals.positions.tail2[0] - start;
    var end = internals.positions.tail1[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
            frame[i + s + offset] = color;
        }

        sequence.push(frame);
    }

    return sequence;
};


internals.sparkle = function (color, duration) {

    var start = internals.positions.circle[0];
    var end = internals.positions.circle[1];

    var sequence = [];
    for (var i = 0; i < duration; ++i) {
        var frame = internals.blank();
        for (var s = start; s <= end; ++s) {
            frame[s] = Math.random() > 0.9 ? color : 0;
        }

        sequence.push(frame);
    }

    return sequence;
};


console.log('var animation = ' + JSON.stringify(internals.compile()) + ';');
