---
replicate: true
date: '2 Feb 2020'
description: 'A better way to generate distinct colors'
---

This experiment uses a perceptually uniform color space and the 
properites of the golden ratio to generate an infinite sequence 
of easily distinguishable at any lightness/saturation level.

[![A screenshot](/resources/assets/better-colors/screenshot.png)](/demos/better-colors.html)

Try it out [here](/demos/better-colors)! Click +/- to add/remove colors. The top row shows the colors
in the sequence side by side, while the lower circle plots the hues of the
colors in the top row. This implementation uses the JavaScript library from
https://www.hsluv.org/.


 In this article, hue will be measured in radians. Hue is generally
 considered to be periodic, i.e. a hue of $3$ is the same as a hue of $3 +
 2\pi$. The idea is that the golden angle is the most "irrational number,"
 which makes for well separated colors.
 
 For example, suppose we start with a hue of $\phi$. If we choose to adjust
 the hue by an angle of $2\pi/3$, then we would only repeat 3 colors, $\phi,
 \phi + 2\pi/3, \phi + 4\pi/3$. Once we get to $\phi + 6\pi/3=\phi+2\pi$, we
 are back to our orignal hue, since hue is periodic, as we noted above. If we
 adjusted the hue by an angle of $2\sqrt{2} \pi$, then the 18 color, which
 has a hue of $\phi + 17 \sqrt{2} \pi \approx \phi + 12.02 \cdot 2 \pi$, is
 equivalent to the hue $\phi + 0.02$, which is very close to $\phi$.

 The golden angle is the most "irrational" in the sense that you need a large
 number of colors before you get "close" to the color you started with. The reason
 is that the golden ratio is difficult to approximate using rational numbers.

 Advantages: 

 - Better spacing than uniform random sampling
 - Faster than Poisson sampling
 - Consistent, i.e. no randomness
 - Not fixed, i.e. the number of colors does not need to be determined beforehand