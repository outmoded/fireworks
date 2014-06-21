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
        [].concat(internals.launch(Colors.blue, 15), internals.burst(Colors.blue, 15)),
        [].concat(internals.launch(Colors.orange, 5), internals.burst(Colors.orange, 5)),
        [].concat(internals.launch(Colors.aqua, 10), internals.burst(Colors.aqua, 10))
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


internals.launch = function (color, size) {

    var start = internals.positions.launcher[0];
    var end = internals.positions.launcher[1];

    var sequence = [];
    for (i = start; i <= end; ++i) {
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
    for (i = start; i <= end; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
            frame[i + s + offset] = color;
        }

        sequence.push(frame);
    }

    return sequence;
};


console.log('var animation = ' + JSON.stringify(internals.compile()) + ';');
