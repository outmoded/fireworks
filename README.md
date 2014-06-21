# fireworks

The NodeConf July 4th Fireworks Show

[![Build Status](https://secure.travis-ci.org/hueniverse/fireworks.png)](http://travis-ci.org/hueniverse/fireworks)

Well, @mikeal said we can't blow shit up and light stuff on fire. Something about not burning down the entire forest, blah blah blah. So instead we're going
to have a virtual fireworks show.

Special thanks to [Kevin Decker](https://twitter.com/kpdecker) for the canvas code powering the simulator.

## Install

Start by installing the module and running the simulator:

```bash
git clone https://github.com/hueniverse/fireworks.git
cd fireworks
npm install
node example
```

Now connect to the server using a browser and watch the animation.

## Script Format

```javascript
var Fireworks = require('fireworks');
var C = Fireworks.color;

var script = [
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

var animation = Fireworks.compile(script);
```

## Internal Format

The fireworks show consists of a pre-define set of 1260 pixels split into three strands, and organized in a flower-like
arrangement:

[![Layout](https://raw.githubusercontent.com/hueniverse/fireworks/master/images/layout-small.png)](https://raw.githubusercontent.com/hueniverse/fireworks/master/images/layout.png)

The animation uses a simple array format:

```javascript
// Colors are expressed as 24 bit RGB values

var black = parseInt('000000', 16);
var white = parseInt('ffffff', 16);

// Each frame is an array of colors for each of
// the pixels on the strand

var frame0 = [white, black, black];
var frame1 = [black, white, black];
var frame2 = [black, black, white];

// Each sequence is an array of frames for a single
// strand in order of frames

var sequence = [frame1, frame2, frame3, frame4, frame5];

// The complete animation is an array with three
// sequences, one for each strand

var animation = [sequence, sequence, sequence];
```

An example animation compiler is included in `example/script.js`. You can change it as you like (as well as the `lib/index.js` file as long as
you comply with the animation array format), restart the server, and refresh your browser.

## How to participate

This is still a work in progress. For now, just fork this and create your own fireworks show. More information on how to share is coming!
