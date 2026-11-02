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
fig_label: A head-on projection shows left and right ball motion, a synchronized side view shows elevation during approach, and both models set the XY catch target.
fig_caption: '<strong>Two models, one catch.</strong> The ball comes toward the catcher. The head-on X projection isolates left/right motion; the side Y projection shows elevation as the ball approaches. Both models predict one intercept at the catcher plane, moving the XY mechanism into position. These are views of the same pitch, not two camera feeds. Switch the pitch to change both target coordinates. The paths, samples and timing are illustrative, not recorded model output or a measured catch-rate demonstration.'
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
