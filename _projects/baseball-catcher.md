---
order: 7
title: Robot Baseball Catcher
authors: <strong>Ashton Palacios</strong>, Derek Benham and another teammate
venue: Robotic Vision class, Brigham Young University
summary: Stereo vision and separate lateral and elevation models guide an XY-mounted catcher to the ball.
figure_family: engineering
figure: assets/figures/baseball-catcher.png
fig: baseball-catcher
fig_aspect: 16/9
fig_label: Both stereo cameras watch the ball approaching head-on, moving horizontally and vertically. Two coordinate-versus-time models predict left/right position and elevation, guiding the catcher to one XY intercept.
fig_caption: '<strong>Watch the pitch come toward the catcher.</strong> Both stereo cameras face the pitcher and observe the same approaching ball. Stereo positions feed separate models for left/right motion and elevation. The small graphs show those coordinates against time, while the catcher view shows both movements together and the ball growing as it approaches. Both predictions set one XY catch target. Switch the pitch to change the target. Camera images, paths, samples and timing are schematic, not recorded project data.'
fig_illustrative: true
about: A three-person class team built a vision pipeline for a catcher mounted on an XY linear-rail system. Stereo images were used to detect and triangulate a pitched ball, estimate its trajectory, and transform the predicted landing point into the catcher's coordinate frame.
year: 2022
credit_note: Known collaborators shown; additional teammate credit to be added.
links:
- text: Demo
  url: https://www.youtube.com/shorts/FXYg8f1PFv4
- text: Project background
  url: /projects/baseball-catcher/
---

The team calibrated the cameras, compared individual approaches, and integrated a working solution. The source describes contour-based ball detection and a least-squares prediction in the combined system. The animation focuses on that shared pipeline rather than attributing Derek's separate Kalman-filter or Gaussian-process experiments to Ashton.
