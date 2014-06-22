// Load modules

var Colors = require('./colors');
var Pos = require('./pos');


// Declare internals

var internals = {};


exports.color = Colors;


exports.compile = function (instructions) {

    var animation = [[], [], [], []];
    [].concat(instructions).forEach(function (element) {

        var segment = internals.render(element);
        for (var i = 0; i < 4; ++i) {
            animation[i] = animation[i].concat(segment[i]);
        }
    });

    return animation;
};


internals.render = function (element) {

    var segment = [[], [], [], []];

    if (element.type === 'overlay') {
        var first = exports.compile(element.first);
        var second = exports.compile(element.second);
        for (var i = 0, il = 4; i < il; ++i) {
            segment[i] = internals.overlay(first[i], second[i], element.offset);
        }

        return segment;
    }

    if (element.type === 'timeline') {
        var offset = 0;
        element.sets.forEach(function (set, index) {

            var seg = exports.compile(set[1]);
            if (!index) {
                segment = seg;
            }
            else {
                offset += set[0];
                for (var i = 0, il = 4; i < il; ++i) {
                    segment[i] = internals.overlay(segment[i], seg[i], offset);
                }
            }
        });

        return segment;
    }

    if (element.type === 'random') {
        for (var s = 0; s < element.duration; ++s) {
            var index = Math.floor(Math.random() * element.sets.length);
            var seg = exports.compile(element.sets[index]);
            if (!s) {
                segment = seg;
            }
            else {
                for (var i = 0, il = 4; i < il; ++i) {
                    segment[i] = internals.overlay(segment[i], seg[i], element.offset * s);
                }
            }
        }

        return segment;
    }

    var colors = [];
    for (var i = 0, p = 0; i < 12; ++i, ++p) {
        var color = element.color || 0;
        if (element.colors) {
            if (p >= element.colors.length) {
                p = 0;
            }

            color = element.colors[p];
        }

        colors.push(color);
    }

    var sizes = [];
    for (i = 0, p = 0; i < 12; ++i, ++p) {
        var size = element.size || 0;
        if (element.sizes) {
            if (p >= element.sizes.length) {
                p = 0;
            }

            size = element.sizes[p];
        }

        sizes.push(size);
    }

    if (element.type === 'launch') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.launch(colors[i], sizes[i], element.blanks);
        }
    }

    if (element.type === 'burst') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.burst(colors[i], sizes[i]);
        }
    }

    if (element.type === 'tails') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.tails(colors[i], sizes[i]);
        }
    }

    if (element.type === 'curve') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.curve(colors[i], element.duration);
        }
    }

    if (element.type === 'sparkle') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.sparkle(colors[i], element.duration);
        }
    }

    if (element.type === 'stars') {
        var count = (element.location === 'inner' ? 6 : 12);
        segment = internals.star(colors[0], sizes[0], element.location, 0);

        for (i = 1; i < count; ++i) {
            var seq = internals.star(colors[i], sizes[i], element.location, i);
            for (var s = 0; s < 3; ++s) {
                segment[s] = internals.overlay(segment[s], seq[s]);
            }
        }
    }

    segment[3] = new Array(segment[0].length);
    if (element.audio) {
        segment[3][0] = element.audio;
    }

    return segment;
};


internals.blank = function () {

    var blank = new Array(Pos.strands.length);
    for (var i = 0; i < Pos.strands.length; ++i) {
        blank[i] = 0;
    }

    return blank;
};


internals.overlay = function (seq1, seq2, offset) {

    offset = offset || 0;
    if (offset === 'end') {
        offset = seq1.length - seq2.length;
        if (offset < 0) {
            offset = 0;
            seq2 = seq2.slice(-1 * seq1.length);
        }
    }

    var isVideo = Array.isArray(seq1[0]);

    if (offset) {
        seq2 = seq2.slice();
        for (var b = 0; b < offset; ++b) {
            seq2.unshift(isVideo ? internals.blank() : null);
        }
    }

    var size = Math.max(seq1.length, seq2.length);
    var combo = [];
    for (var i = 0; i < size; ++i) {
        if (isVideo) {
            var frame = internals.blank();
            for (var s = 0; s < Pos.strands.length; ++s) {
                frame[s] = (seq2[i] && seq2[i][s]) || (seq1[i] && seq1[i][s]) || 0;
            }

            combo.push(frame);
        }
        else {
            combo.push(seq2[i] || seq1[i]);
        }
    }

    return combo;
};


internals.launch = function (color, size, blanks) {

    var start = Pos.mark.launcher[0];
    var end = Pos.mark.launcher[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < size && s + i < end; ++s) {
            frame[i + s] = color;
        }

        sequence.push(frame);
    }

    for (i = 0; i < blanks; ++i) {
        sequence.push(internals.blank());
    }

    return sequence;
};


internals.burst = function (color, size) {

    var start = Pos.mark.burst1[0];
    var offset = Pos.mark.burst2[0] - start;
    var end = Pos.mark.burst1[1];

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

    var start = Pos.mark.tail1[0];
    var offset = Pos.mark.tail2[0] - start;
    var end = Pos.mark.tail1[1];

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


internals.curve = function (color, duration) {

    var start = Pos.mark.curve[0];
    var end = Pos.mark.curve[1];

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


internals.sparkle = function (color, duration) {

    var start = Pos.mark.burst1[0];
    var end = Pos.mark.curve[1];

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


internals.star = function (color, size, curve, id) {

    var sequences = [[], [], []];
    var pos = Pos.mark.star[curve][id];

    var draw = function (color) {

        for (var i = 0; i < size; ++i) {
            var frames = [internals.blank(), internals.blank(), internals.blank()];
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
