# fireworks

The NodeConf July 4th Fireworks Show

[![Build Status](https://secure.travis-ci.org/hueniverse/fireworks.png)](http://travis-ci.org/hueniverse/fireworks)

Well, @mikeal said we can't blow shit up and light stuff on fire. Something about not burning down the entire forest, blah blah blah. So instead we're going
to have a virtual fireworks show. The fireworks show consists of a pre-define set of 1260 pixels split into three strands, and organized in a flower-like
arrangement and an animation data format:

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

var animaiton = [sequence, sequence, sequence];
```

The strands are organized as follows:

[![Layout](https://raw.githubusercontent.com/hueniverse/fireworks/master/images/layout-small.png)](https://raw.githubusercontent.com/hueniverse/fireworks/master/images/layout.png)