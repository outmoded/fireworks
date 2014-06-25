// Load modules

var ColorConvert = require('color-convert');
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

    if (element.type === 'blank') {
        for (i = 0, il = 3; i < il; ++i) {
            var seq = [];
            for (var b = 0; b < element.duration; ++b) {
                seq.push(internals.blank());
            }

            segment[i] = seq;
        }
    }

    if (element.type === 'launch') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.launch(colors[i], sizes[i], element.blanks);
        }
    }

    if (element.type === 'whirl') {
        segment = internals.whirl(colors[0], sizes[0]);
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

    if (element.type === 'spin') {
        segment = internals.spin(colors[0], element.location, sizes[0], element.steps, element.offset);
    }

    if (element.type === 'sparkle') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.sparkle(colors[i], element.duration);
        }
    }

    if (element.type === 'stars') {
        var count = (element.location === 'inner' ? 6 : 12);
        segment = internals.star(colors[0], sizes[0], sizes[0], element.location, 0);

        for (i = 1; i < count; ++i) {
            var seq = internals.star(colors[i], sizes[i], sizes[i], element.location, i);
            for (var s = 0; s < 3; ++s) {
                segment[s] = internals.overlay(segment[s], seq[s]);
            }
        }
    }

    if (element.type === 'solid') {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = internals.solid(colors[i]);
        }
    }

    if (element.slice) {
        for (i = 0, il = 3; i < il; ++i) {
            segment[i] = Array.prototype.slice.apply(segment[i], [].concat(element.slice));
        }
    }

    if (element.stretch > 1) {
        var frames = segment[0].length;
        for (i = 0, il = 3; i < il; ++i) {
            var seg = [];
            for (var f = 0; f < frames; ++f) {
                for (var s = 0; s < element.stretch; ++s) {
                    seg.push(segment[i][f]);
                }
            }

            segment[i] = seg;
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


internals.color = function (color, pos, size) {

    if (!Array.isArray(color)) {
        return !size ? color : internals.fade(color, pos, size);
    }

    return color[pos % color.length];
};


internals.fade = function (color, pos, size) {

    var rgb = [(color & (255 << 16)) >> 16, (color & (255 << 8)) >> 8, color & 255];
    var hsv = ColorConvert.rgb2hsv(rgb);
    hsv[2] -= Math.floor(hsv[2] / size * pos);
    rgb = ColorConvert.hsv2rgb(hsv);
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
};


internals.launch = function (color, size, blanks) {

    var start = Pos.mark.launcher[0];
    var end = Pos.mark.launcher[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < size && i - s >= 0; ++s) {
            frame[i - s] = internals.color(color, s, size);
        }

        sequence.push(frame);
    }

    for (i = 0; i < blanks; ++i) {
        sequence.push(internals.blank());
    }

    return sequence;
};


internals.whirl = function (color, size) {

    //   012
    // 5 x    [0,5]
    // 4 x    [0,4]
    // 3  x   [1,3]
    // 2   x  [2,2]
    // 1   x  [2,1]
    // 0  x   [1,0]

    var height = Pos.mark.launcher[1];
    var path = [0, 0, 1, 2, 2, 1];

    var sequences = [[], [], []];
    for (var i = 0; i < height; ++i) {
        var frames = [internals.blank(), internals.blank(), internals.blank()];
        for (var s = 0; s < size && i - s >= 0; ++s) {
            var strand = path[(i - s) % path.length];
            frames[strand][i - s] = internals.color(color, s, size);
        }

        for (s = 0; s < 3; ++s) {
            sequences[s].push(frames[s]);
        }
    }

    return sequences;
};


internals.burst = function (color, size) {

    var start = Pos.mark.burst1[0];
    var offset = Pos.mark.burst2[0] - start;
    var end = Pos.mark.burst1[1];

    var sequence = [];
    for (var i = start; i <= end; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < size && i - s >= start; ++s) {
            frame[i - s] = internals.color(color, s, size);
            frame[i - s + offset] = internals.color(color, s, size);
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
        for (var s = 0; s < size && i - s >= start; ++s) {
            frame[i - s] = internals.color(color, s, size);
            frame[i - s + offset] = internals.color(color, s, size);
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
            frame[s] = Math.random() > 0.9 ? internals.color(color, 0, 0) : 0;
        }

        sequence.push(frame);
    }

    return sequence;
};


internals.spinSetup = function (strand) {

    var start = Pos.mark.curve[0];
    var end = Pos.mark.curve[1];

    var pixels = [];
    for (var i = start; i <= end; ++i) {
        pixels.push([strand, i]);
    }

    return pixels;
};


internals.spinners = {
    inner: internals.spinSetup(0),
    outter: internals.spinSetup(1).concat(internals.spinSetup(2))
};


internals.spin = function (color, location, size, steps, offset) {

    offset = offset || 0;
    var pixels = internals.spinners[location];
    var sequences = [[], [], []];
    for (var i = 0; i < steps; ++i) {
        var frames = [internals.blank(), internals.blank(), internals.blank()];
        for (var s = 0; s < size; ++s) {
            var pos = i - s + offset;
            var pixel = pixels[(pos < 0 ? pos + pixels.length : pos) % pixels.length];
            frames[pixel[0]][pixel[1]] = internals.color(color, s, size);
        }

        for (s = 0; s < 3; ++s) {
            sequences[s].push(frames[s]);
        }
    }

    return sequences;
};


internals.sparkle = function (color, duration) {

    var start = Pos.mark.burst1[0];
    var end = Pos.mark.curve[1];

    var sequence = [];
    for (var i = 0; i < duration; ++i) {
        var frame = internals.blank();
        for (var s = start; s <= end; ++s) {
            frame[s] = Math.random() > 0.9 ? internals.color(color, 0, 0) : 0;
        }

        sequence.push(frame);
    }

    return sequence;
};


internals.star = function (color, size, radius, location, id) {

    var sequences = [[], [], []];
    var pos = Pos.mark.star[location][id];

    var draw = function (color) {

        for (var i = 0; i < radius; ++i) {
            var frames = [internals.blank(), internals.blank(), internals.blank()];
            for (var l = 0; l < 4; ++l) {
                var line = pos[l];

                var strand = line[0];
                var led = line[1];
                var direction = line[2];

                for (var s = 0; s < size && i - s >= 0 ; ++s) {
                    frames[strand][led + ((i - s) * direction)] = internals.color(color, s, size);
                }
            }

            for (s = 0; s < 3; ++s) {
                sequences[s].push(frames[s]);
            }
        }
    };

    draw(color);
    draw(0);

    return sequences;
};


internals.solid = function (color) {

    var sequence = [];
    for (var i = 0; i < 420; ++i) {
        var frame = internals.blank();
        for (var s = 0; s < i; ++s) {
            frame[i - s] = internals.color(color, s, 420);
        }

        sequence.push(frame);
    }

    return sequence;
};
