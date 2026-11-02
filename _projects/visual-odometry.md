---
order: 6
title: Monocular Visual Odometry
authors: <strong>Ashton Palacios</strong> and Derek Benham
venue: School project, Brigham Young University
summary: Estimating camera motion from matched visual features in RC-car footage.
figure_family: engineering
figure: assets/figures/visual-odometry.png
fig: visual-odometry
fig_aspect: 16/9
fig_label: Features are matched between two schematic camera frames. Accepted matches contribute to an estimated trajectory that drifts from an illustrative reference path.
fig_caption: '<strong>Correspondences become motion estimates.</strong> SIFT features are matched between frames; essential-matrix estimation and RANSAC help recover relative motion. Poses accumulate into a trajectory with drift. Adjust the illustrative drift to see why small errors matter. The original project processed monocular RC-car footage offline, without IMU or wheel-odometry fusion. Features, paths and the reference curve here are synthetic, not the project dataset or measured ground truth.'
fig_illustrative: true
about: This project explored monocular visual odometry using imagery from a RealSense D435 mounted on the RC-car platform. The described pipeline extracted SIFT features, matched them with nearest-neighbor search, and used essential-matrix estimation with RANSAC to recover relative camera motion. Successive estimates were accumulated into a trajectory.
year: 2022
links:
- text: Demo
  url: https://www.youtube.com/watch?v=fXM8YLXXC4w
- text: Project background
  url: https://drbenham.website/vo
---

Processing was performed offline rather than on the car's constrained onboard computer, and did not fuse IMU or wheel-odometry measurements. The source describes drift during jittery turns and compares a separate test dataset with established ground truth; the RC-car run itself did not have a complete ground-truth trajectory.
