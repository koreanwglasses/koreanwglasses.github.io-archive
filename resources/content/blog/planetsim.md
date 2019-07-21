---
replicate: true
command: 'cat blog/planetsim.md'
---

_Before 2016_

The n-body problem and concepts of Newtonian gravity can be explored through the use of this interactive program that models the gravitational interactions of objects on a plane. A fun fact: this application was one of the first UI applications I created, and I managed to create a visual, numerical-differential equation solver without even knowing what a differential equation was!

 ![4D Sphere](/resources/assets/planetsim/INTER2.PNG) 
 
 _A random configuration of "planets" around a "sun" after a few seconds of simulation. The area of a planet is proportional to its mass._ 
 
 ![4D Sphere](/resources/assets/planetsim/INTER2-2.PNG)
 
  _The same configuration as above after a few minutes. Some of the largest planets are highlighted_ 
  
  ![4D Sphere](/resources/assets/planetsim/INTER2-4.PNG) 
  
  _The same configuration as above after several more minutes. At this point, there will be no more collisions for a long time, and is considered stable._

_Written in Java using the LIBGDX Framework. Source Code: https://github.com/koreanwglasses/planetsim2d)

The planet simulation calculates Newtonian gravity on objects on restricted to a 2-dimensional plane. In addition to the basic planet simulation, it uses dynamic subframe calculations to improve the precision of the simulation while also ensuring a smooth experience.

Try it out here - [PSIM.jar](/resources/assets/planetsim/PSIM.jar)

Some sample configurations

*   Sun Earth Moon - [SunEarthMoon.psim](/resources/assets/planetsim/SunEarthMoon.psim)

*   A simulation of the Earth's orbit around the sun, and the moon's orbit around the Earth (to scale!)
*   Try typing in 'EARTH' in the upper left hand corner, then click 'Focus'!

*   Double Moon - [DoubleMoon.psim](/resources/assets/planetsim/DoubleMoon.psim)

*   Two planets with moons, orbiting around each other

User Guide

*   Basic Tutorial

> *   Press space to run / pause the simulation (starts out paused)
> *   Click and drag on empty space to create a planet with random mass and radius
> *   Press 'A' to toggle arrows
> *   Use mouse wheel to zoom in/out
> *   Press 'C' to switch between follow cam and fixed camera
> *   Left-click a planet to focus and see its properties
> *   Press 'G' to turn off the relative grid
> *   Press 'C' to unfocus from a planet
> *   Right-click a planet to remove

*   Advanced Tutorial

> *   Click the '«' button in the upper right hand corner to open the menu panel
> *   Use the save and load buttons to save and load a configuration respectively. (Note: Simulation pauses upon save / load)
> *   Use the pause button (or the spacebar) to pause / run the simulation
> *   Use the reset button to delete all planets
> *   Use the slider to adjust the speed of the simulation.
> *   Use the text boxes to adjust properties of new planets.
> 
> *   Each field adjusts the corresponding property on new planets.
> *   Clicking 'Ok' applies user defined properties to new planets (created by clicking + dragging), while leaving undefined fields as default / random
> *   Clicking 'Create' requires the 'Pos' and 'Vel' fields to be filled in.
> 
> *   Use the search in the upper-left corner to focus on a specific planet.

*   Tips and Tricks

> *   Focus on a planet and check orbit (then click 'OK') then click on empty space to create a planet that will orbit around the focused planet (provided that the other planets' gravity do not interfere of course)