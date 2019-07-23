---
replicate: true
command: "cat /projects/physik.md"
date: 22 Jul 2019
---

# PhysIK
A physics based inverse kinematics solver.

## Introduction

I created PhysIK, a Blender plugin, for the final project of my advanced computer graphics class in the spring of 2019. The repository can be found [here](https://github.com/koreanwglasses/forward-inverse-kinematics). The associated paper can be found [here](https://github.com/koreanwglasses/forward-inverse-kinematics/blob/master/paper.pdf). 

## What is Inverse Kinematics?

Inverse kinematics is a general term for computing the relative configurations of rods and joints to achieve a desired configuration. For example, inverse kinematics is used in robots to determine what angle to set each joint at for the tip of an arm to reach a certain point. In animation, inverse kinematics is used to compute the positions of the intermediate bones to effect a certain pose. 

## What does PhysIK do?

PhysIK simulates simple rigid body physics with constraints in order to make inverse kinematics as intuitive as possible, especially in animation. The idea is that the user will be able to model a pose just as easily as one would pose a wooden armature for drawing. Real life is intuitive, so if PhysIK can simulate real life by using physics, then posing should be intuitive!

## How does it work?

![Pinhead](https://github.com/koreanwglasses/forward-inverse-kinematics/raw/master/docs/pinhead.png)

Above is a rig that I will call "Pinhead." He consists of rigid bones and joints that connect the bones. The main purpose of the joints are to ensure that bones that start connected remain connected. Now suppose we want to move his arm forward. It might seem like an easy task, but you also have to consider how his upper arm would move, and how the rest of his body would move as well. The easiest solution would be to move the whole body to meet the arm! But that is probably not what we want. We can attempt to minimize the number of bones moved. In which case we end up with a pose like the one below.

![IK with iTasc algorithm](https://github.com/koreanwglasses/forward-inverse-kinematics/raw/master/docs/pose-hand-itasc.png)

Here you can actually see two crosshairs. One to hold the other arm in place (not neccessary right now, but will be later!), and another to tell the hand where to point. Now this looks alright, but the shoulders seem a bit stiff, and he looks overall unbalanced. Now lets compare it with Physik:

![IK with PhysIK](https://github.com/koreanwglasses/forward-inverse-kinematics/raw/master/docs/pose-hand.png)

Here we see his whole body has moved along with the arm. We can see that there is also a slight bend in his knees, which is due to the way angular constraints are enforced. Overall, it generates a much more natural pose, just by manipulating a single target.

So how does PhysIK achieve this effect? 

First, imagine a spring connecting each crosshair to its corresponding position on the bone. PhysIK simulates the forces from the springs to move the different parts of the rig into place. You can see this on a much simpler rig such as the one below.

![](https://github.com/koreanwglasses/forward-inverse-kinematics/raw/master/docs/demo-elbow.gif)

Here you can also see the effects of angular constraints. The joint is not allowed to bend past 90 degrees, so PhysIK simulates another spring to push it open. Now the tricky part is making sure the rig doesnt fly apart and bones don't detach at their joints. While you can read more in depth about the physical calculations (and more about the algorithm itself) in the paper, basically, I just make sure that the acceleration between any two bones connected at a joint is as close as possible. Then the bones should move together. This is just one way of computing the dynamics of rigid bodies with constraints, and the simplest to implement from scratch. Thus the force of a spring will propagate among all the different bones causing the whole rig to move at least a little. The result is a natural looking pose with minimal effort!

![](https://github.com/koreanwglasses/forward-inverse-kinematics/raw/master/docs/wave.gif)

# Read More

You can find the paper here: https://github.com/koreanwglasses/forward-inverse-kinematics/blob/master/paper.pdf