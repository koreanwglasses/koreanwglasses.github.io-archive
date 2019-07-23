---
replicate: true
---

_Before 2016_

Musaic is an application that turns music into art. It works by taking several samples of sound a second, mapping each sample to a color based on its
frequency and intensity, and placing a blob of that color near other blobs of a similar color. The end result is a colorful, abstract rendition of music as 
a visual form of art, a Musaic.

[![](http://img.youtube.com/vi/j-ntCsvdzB0/0.jpg)](http://www.youtube.com/watch?v=j-ntCsvdzB0 "")

_Youtube Video_

This was inspired in part by this answer on *Programming Puzzles and Code Golf* http://codegolf.stackexchange.com/a/22326/44953
in which the user *fejesjoco* developed an algorithm to create aesthetically pleasing images containing all the colors on a standard computer screen.
I use a similar algorithm to place colors on the screen, except that I use voronoi cells instead of a pixel grid, and I use colors based on sound samples
instead of just random colors.

The colors are determined by taking a sound sample and running a fourier analysis on it to get the frequencies as a histogram. Each frequency
is mapped to a color, and all the frequencies are added together, weighted by their amplitude. Thus each pitch, timbre, and harmony maps
to a different color, and louder sounds are more intense/saturated while softer sounds are more washed out. 

![Spem in Alium - Thomas Tallis](/resources/assets/musaic/tallis1.PNG)

*Spem in Alium - Thomas Tallis*

![Piano Sonata No.14 (Moonlight) - Beethoven](/resources/assets/musaic/moonlight.PNG)

*Piano Sonata No.14 (Moonlight) - Beethoven*

With the chaotic nature involved in recording sound, a different image is produced every time, even with the same song. Yet different songs
have their own distinct styles. The famous Moonlight Sonata, a piece from the Romantic era of classical music, is slow and meditative, with a variety of
arpeggiated 7 and 9 chords that create a colorful dissonance, which translates to a variety of color in Musaic. Spem in Alium, a 40 voice motet by Thomas Tallis, is a more baroque piece. When sung,
the voices sound like the constant and powerful sound of an organ. The piece also has the unique characteristic in that it it composed of mostly triads
in the tonic and the dominant keys, thus the image is dominated by two colors, green and blue, with bits of other colors mixed in as well.

Footnote: If you would like a preview, please send me an email at koreanwglasses@gmail.com