---
layout: project-background
title: Self-Driving RC Racer
project_slug: rc-racer
permalink: /projects/rc-racer/
description: Camera-based obstacle detection, greedy path planning and recovery on a classroom RC racing platform.
---

## The challenge

In March 2022, our three-person Robotic Vision team programmed an RC car to navigate a classroom track. Blue and green pool noodles formed the inner and outer boundaries, while orange cones created additional obstacles. The class challenge combined timed runs with a head-to-head race.

The platform used a Traxxas 4WD chassis, a motor encoder, an Intel RealSense D435 stereo depth camera with an IMU, and an Nvidia TX1 onboard computer. Limited computing capacity made inexpensive image processing and timely steering decisions central to the design.

## From camera frames to obstacles

The perception pipeline separated camera images into hue, saturation and value channels. Binary color thresholds isolated the blue and green boundaries and the red/orange cones. A bitwise OR combined those masks into a single obstacle image, which was reduced to a small grid for planning.

The original camera frame, thresholded mask and reduced grid appear below. These are project images; the animated track above is a separate illustrative explanation.

## Planning and steering

The team developed navigation approaches independently, shared ideas and integrated useful parts. One approach used a reactive grid of turn values to prioritize nearby obstacles. Another used a Euclidean distance map to represent clearance from boundaries and cones, followed by local and global greedy searches.

The local search constrained how far successive points could move sideways. The global search provided a broader direction to help avoid getting trapped in local choices. Filtering and a weighted least-squares line fit stabilized the global direction. The two directions were combined into a steering command, then passed through a PD controller to reduce turning oscillations.

Derek Benham's project account describes the distance-map and greedy-search approach as his contribution. This draft documents the team's system; Ashton's individual contribution and the third teammate's name will be added separately.

## Recovery when the car gets stuck

Recovery used IMU readings and the clearance map to detect situations where the car should reverse. One trigger watched for low IMU readings across consecutive frames. Another checked whether the local path points indicated insufficient clearance ahead. Backing up gave the camera a different view before trying again.

The IMU trigger also exposed a limitation: a straight run at top speed could sometimes look like a stop and cause an unnecessary reversal. This made recovery logic part of the navigation problem rather than a simple fallback.

## Race results and lessons

The project account records a tie for the fastest obstacle-free time, third place on the cone course after a cone-hit penalty, and advancement to the final head-to-head race, where the team finished second.

The winning team detected the carpet instead of explicitly detecting obstacles. Its simpler processing supported a higher frame rate, illustrating a useful tradeoff: a more elaborate planner can lose ground when perception updates arrive too slowly.

The following original images show the vehicle and the perception-to-steering pipeline. Small source images are kept at their native size to avoid overstating their detail.
