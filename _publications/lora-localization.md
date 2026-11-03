---
order: 3
title: Low-Cost Urban Localization with Magnetometer and LoRa Technology
authors: Derek Benham, <strong>Ashton Palacios</strong>, Philip Lundrigan, Joshua G. Mangelson
venue: IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS), Abu Dhabi, UAE
year: 2024
summary: LoRa signal maps, probabilistic motion classification and magnetometer heading localize a mobile robot.
about: Four LoRa beacons supply signal-strength measurements. Gaussian processes model each beacon's spatial signal field, while a signal-similarity classifier estimates whether the robot moved. These motion estimates, magnetometer heading and signal-map observations are fused in a particle filter. The proposed configuration averaged 2.57 m RMSE on the five test segments with adjacent prior training coverage.
figure_family: engineering
figure: assets/figures/lora-localization.png
fig: lora-localization
fig_aspect: 16/9
fig_label: A campus robot receives signals from four LoRa beacons. Signal history and heading inform motion, while signal-map comparisons reweight particles and update the position estimate. Stopping the robot changes the motion evidence.
fig_caption: '<strong>Signals tell us where—and whether we moved.</strong> Recent RSSI patterns inform a probabilistic moving/stopped decision. That decision and magnetometer heading guide motion samples; per-beacon signal maps then update the location belief. Stop or resume the robot, or step the filter. The animation uses illustrative fields and a toy classifier to explain the published GP/GMM pipeline; it does not run the trained research models or reproduce experimental results.'
fig_illustrative: true
link: assets/papers/lora-localization.pdf
link_label: Paper
links:
- text: IEEE Xplore
  url: https://ieeexplore.ieee.org/document/10801786
  note: Published version
- text: Research background
  url: /publications/lora-localization/
---

The published classifier estimates moving versus stopped, rather than directly regressing an exact travel distance. Classification confidence controls motion uncertainty. Training coverage matters: results are weaker in regions without adjacent prior data, especially near the boundary of the signal map.
