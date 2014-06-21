var LIGHTS_PER_METER = 30;
var NUM_PIXELS = [
  5,
  10,

  5, 1, 2, 1,
  5, 1, 2, 1,
  5, 1, 2, 1
].map(function (value) { return Math.floor(value * LIGHTS_PER_METER); });


var NUM_CIRCLES = 2;
var NUM_LINES = NUM_PIXELS.length - NUM_CIRCLES;
var FULL_CIRCLE = 2 * Math.PI;
var PX_PER_METER = 200;
var OUTER_RADIUS = 2;
var OFFSET = OUTER_RADIUS * PX_PER_METER;
var FOLD_RADIUS = 0.1;
var ROTATE = Math.PI / 4.1;


var mapLine = function (line, pixelId) {

    // Circular components

    if (line < NUM_CIRCLES) {
        var radius = 5 * (line + 1) / FULL_CIRCLE,
            angle = FULL_CIRCLE * (pixelId / NUM_PIXELS[line]) + ROTATE;

        return [radius * Math.cos(angle), radius * Math.sin(angle), 0];
    }

    // Straight lines

    var lineOffset = line - NUM_CIRCLES;
    var lineMod = lineOffset % 4;

    // A bit of a hack here. We want to fold one of the lines slightly early
    // to provide spacing between other objects displayed on the screen.
    // If rotate is changed then the special casing here will need to be adjusted.

    var currentFold = lineOffset / 4 < 1 ? FOLD_RADIUS * 1.8 : FOLD_RADIUS;

    var angle = FULL_CIRCLE * lineOffset / NUM_LINES + ROTATE;
    var radius = OUTER_RADIUS - pixelId / LIGHTS_PER_METER;

    if (!lineMod &&
        radius < currentFold) {

        // Fake the depth for the components that are "folded over"

        return [
          currentFold * Math.cos(angle),
          currentFold * Math.sin(angle) - radius + currentFold,
          currentFold - radius
        ];
    }

    return [radius * Math.cos(angle), radius * Math.sin(angle), 0];
};


var lightPixelByLine = function (line, pixel, color) {

    var output = document.getElementById('output');
    var context = output.getContext('2d');

    var map = mapLine(line, pixel);
    context.fillStyle = color;
    context.fillRect(OFFSET + PX_PER_METER * map[0], OFFSET + PX_PER_METER * map[1], 4, 4);
};


var STRANDS = [
    [2, 12, 11, 13, 0],
    [10, 8, 7, 9, 1],
    [6, 4, 3, 5, 1]
];


var lightPixel = function (strandId, led, color) {

    var strand = STRANDS[strandId];
    var offset = led;

    var line;
    var px;

    for (var l = 0, ll = strand.length; l < ll; ++l) {
        line = strand[l];
        var length = NUM_PIXELS[line];

        if (line === 1) {
            if (strandId === 2) {
                length /= 2;
            }
        }

        px = length - offset - 1;
        if (px > -1) {
            break;
        }

        offset -= length;
    }

    lightPixelByLine(line, px, color);
};


var play = function (animation, delay) {

    var source = [];
    animation.forEach(function (strand, id) {

        if (strand.length) {
            source.push({ id: id, data: strand });
        }
    });

    var display = function (tick, strands) {

        var nextRound = [];
        for (var i = 0, il = strands.length; i < il; ++i) {
            var strand = strands[i];
            if (strand.data.length > tick + 1) {
                nextRound.push(strand);
            }

            var leds = strand.data[tick];
            for (var l = 0, ll = leds.length; l < ll; ++l) {
                lightPixel(strand.id, l, toHex(leds[l]));
            }
        }

        setTimeout(function () {

            if (nextRound.length) {
                display(tick + 1, nextRound);
            }
            else {
                display(0, source);
            }
        }, delay);
    };

    display(0, source);
};


var toHex = function (number) {

    var hex = number.toString(16);
    var pad = '000000';
    return '#' + pad.substring(0, pad.length - hex.length) + hex;
};