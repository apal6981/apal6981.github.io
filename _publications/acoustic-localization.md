---
order: 2
title: One-Way Acoustic Signal Localization using Received Signal Strength
authors: Derek Benham, Clayton Smith, Tristan Hodgins, <strong>Ashton Palacios</strong>, Philip Lundrigan, Joshua G. Mangelson
venue: IEEE OES/MTS OCEANS 2025 Great Lakes, Chicago, USA
year: 2025
summary: Learned acoustic signal maps and a particle filter estimate position in a shallow, multipath-prone marina.
about: Four acoustic beacons provide received-signal-strength observations. A separate Gaussian-process model maps each beacon's signal field; commanded speed and heading propagate candidate positions, and sequential RSS observations reweight and resample them. Experiments used a surface vessel with a submerged receiver, reporting a mean localization error of 17.4 m versus 21.3 m for a bearing-only update.
figure_family: engineering
figure: assets/figures/acoustic-localization.png
fig: acoustic-localization
fig_aspect: 16/9
fig_label: A vessel moves between four acoustic beacons over an illustrative signal map. Candidate positions move, change weight after one beacon observation, and resample into an updated position belief.
fig_caption: '<strong>Listen to the signal landscape.</strong> Each beacon has its own learned RSS map. The particle filter propagates possible positions using commanded speed and heading, then compares one received strength with its map and resamples. Use Step filter to inspect the three stages. The animation uses synthetic signal fields and data, not trained Gaussian processes, recorded routes or a reproduction of reported accuracy. Reference position is shown for explanation and is not used as a position measurement.'
fig_illustrative: true
link: assets/papers/acoustic-localization.pdf
link_label: Paper
links:
- text: Research background
  url: /publications/acoustic-localization/
---

The localization update does not require time-of-flight ranging, bearing measurements or synchronized clocks. The experimental hardware polled the beacons sequentially; the background page distinguishes this collection setup from the one-way measurement method.
