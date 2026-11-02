---
layout: project-background
title: Robot Baseball Catcher
project_slug: baseball-catcher
permalink: /projects/baseball-catcher/
gallery_key: baseball_catcher
demo_label: Watch the catcher demo
preview_caption: Illustrative head-on stereo observations feeding lateral and elevation models for one XY catch target.
description: Stereo ball tracking and separate lateral and elevation models for an XY robot catcher.
---

## The challenge

In February 2022, our three-person Robotic Vision team worked on a robot that could catch balls launched across a room. A pitching machine sent balls toward a catcher mounted on an XY linear-rail system. Stereo cameras above the catcher tracked the incoming ball so the mechanism could move to its predicted intercept.

The project account describes pitches at about 25 mph and stereo tracking at 30 frames per second. The goal was to catch 20 consecutive catchable pitches, which the team achieved. “Catchable” meant within the mechanism's physical range of motion; pitches outside that range were excluded. These are results reported in the project account, not measurements from the animation.

## From two images to a 3D ball position

The team collected test images and calibrated the stereo cameras together, then developed individual implementations before integrating a shared solution. Detecting the ball in both images made it possible to use disparity—the difference between its image positions—to estimate its location relative to the cameras.

The integrated pipeline used contour area to locate the ball. Derek Benham's initial implementation used Hough circles; his account reports that the contour approach was less susceptible to noise. The original stereo detection frame below shows a highlighted ball location in each camera image.

## Two models for one pitch

Both stereo cameras watched the ball come toward the catcher from the pitcher. Each image contained both left/right and vertical motion. The cameras did not observe the pitch from the side.

We modeled lateral motion and elevation separately using positions reconstructed from those same stereo observations. Together, the two models predicted where the ball would reach the catcher plane and set the mechanism's XY target.

The animation keeps both camera views head-on. The catcher view shows the ball shifting sideways and changing height together, growing as it approaches. The two small model graphs plot lateral position and elevation against time; they are derived predictions, not additional camera viewpoints. Camera images, curves and timing are schematic rather than recorded project output.

## Predict, transform and move

A least-squares prediction estimated where the ball would reach the catcher. That location had to be transformed from the cameras' coordinate frame into the mechanism's coordinate frame before commanding movement. Calibration, camera orientation, pitching-machine variability and mechanism uncertainty all affected the final result.

Timeliness mattered as much as the estimate itself: waiting for more observations left less time for the mechanism to move. The accompanying figure makes this sequence visible—collect observations, predict both coordinates, then move to the shared intercept—using schematic timing.

## Experiments and tradeoffs

Derek's account also describes Kalman-filter and Gaussian-process regression experiments. The Kalman filter did not improve the implemented model, and Gaussian-process regression was too computationally expensive compared with the simpler least-squares approach. The original side-view Gaussian-process plot is included below as an experimental artifact; it is not the final integrated controller and does not represent Ashton's individual work.

This draft preserves the shared project description. Ashton's individual contributions and the remaining teammate's name will be filled in separately.
