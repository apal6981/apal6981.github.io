---
order: 7
title: Robot Baseball Catcher
authors: <strong>Ashton Palacios</strong>, Derek Benham and another teammate
venue: Robotic Vision class, Brigham Young University
summary: Stereo vision predicts a ball's intercept so an XY-mounted catcher can move into position.
figure_family: engineering
figure: assets/figures/baseball-catcher.png
fig: baseball-catcher
fig_aspect: 16/9
fig_label: Left and right cameras observe a pitched ball. Their viewing rays intersect at a 3D sample, a predicted path reaches the catch plane, and an XY catcher moves to the intercept.
fig_caption: '<strong>Observe, triangulate, intercept.</strong> Stereo observations locate the ball in three dimensions. A fitted trajectory predicts its position at the catcher plane, and the XY mechanism moves to meet it. Switch the pitch to see a new target. The trajectory, samples and timings are illustrative; the animation is not real camera footage, a hardware controller or a measured catch-rate demonstration.'
fig_illustrative: true
about: A three-person class team built a vision pipeline for a catcher mounted on an XY linear-rail system. Stereo images were used to detect and triangulate a pitched ball, estimate its trajectory, and transform the predicted landing point into the catcher's coordinate frame.
year: 2022
credit_note: Known collaborators shown; additional teammate credit to be added.
links:
- text: Demo
  url: https://www.youtube.com/shorts/FXYg8f1PFv4
- text: Project background
  url: https://drbenham.website/baseball_catcher
---

The team calibrated the cameras, compared individual approaches, and integrated a working solution. The source describes contour-based ball detection and a least-squares prediction in the combined system. The animation focuses on that shared pipeline rather than attributing Derek's separate Kalman-filter or Gaussian-process experiments to Ashton.
