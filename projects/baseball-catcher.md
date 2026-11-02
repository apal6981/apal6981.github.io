---
layout: project-background
title: Robot Baseball Catcher
project_slug: baseball-catcher
permalink: /projects/baseball-catcher/
gallery_key: baseball_catcher
demo_label: Watch the catcher demo
preview_caption: Illustrative head-on and side projections of one pitch, combined into an XY catch target.
description: Stereo ball tracking and separate lateral and elevation models for an XY robot catcher.
---

## The challenge

In February 2022, our three-person Robotic Vision team worked on a robot that could catch balls launched across a room. A pitching machine sent balls toward a catcher mounted on an XY linear-rail system. Stereo cameras above the catcher tracked the incoming ball so the mechanism could move to its predicted intercept.

The project account describes pitches at about 25 mph and stereo tracking at 30 frames per second. The goal was to catch 20 consecutive catchable pitches, which the team achieved. “Catchable” meant within the mechanism's physical range of motion; pitches outside that range were excluded. These are results reported in the project account, not measurements from the animation.

## From two images to a 3D ball position

The team collected test images and calibrated the stereo cameras together, then developed individual implementations before integrating a shared solution. Detecting the ball in both images made it possible to use disparity—the difference between its image positions—to estimate its location relative to the cameras.

The integrated pipeline used contour area to locate the ball. Derek Benham's initial implementation used Hough circles; his account reports that the contour approach was less susceptible to noise. The original stereo detection frame below shows a highlighted ball location in each camera image.

## Two models for one pitch

We ran separate models to account for lateral motion and elevation. From a head-on perspective, the ball comes toward the catcher while moving left or right. A side view makes the change in height during that approach visible. Both models refer to the same ball and the same arrival at the catcher plane.

The animation separates these dimensions deliberately: the head-on X projection isolates left/right movement, and the side Y projection shows height against progress toward the catcher. Their predictions combine into one XY target. The displayed curves and samples are illustrative, rather than a replay of the project's fitted coefficients or a reconstruction of camera footage.

## Predict, transform and move

A least-squares prediction estimated where the ball would reach the catcher. That location had to be transformed from the cameras' coordinate frame into the mechanism's coordinate frame before commanding movement. Calibration, camera orientation, pitching-machine variability and mechanism uncertainty all affected the final result.

Timeliness mattered as much as the estimate itself: waiting for more observations left less time for the mechanism to move. The accompanying figure makes this sequence visible—collect observations, predict both coordinates, then move to the shared intercept—using schematic timing.

## Experiments and tradeoffs

Derek's account also describes Kalman-filter and Gaussian-process regression experiments. The Kalman filter did not improve the implemented model, and Gaussian-process regression was too computationally expensive compared with the simpler least-squares approach. The original side-view Gaussian-process plot is included below as an experimental artifact; it is not the final integrated controller and does not represent Ashton's individual work.

This draft preserves the shared project description. Ashton's individual contributions and the remaining teammate's name will be filled in separately.
