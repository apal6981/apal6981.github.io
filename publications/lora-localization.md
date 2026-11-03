---
layout: publication-background
publication_slug: lora-localization
title: LoRa and Magnetometer Localization — Research Background
permalink: /publications/lora-localization/
description: How LoRa signal-strength maps, a probabilistic motion classifier and magnetometer heading support low-cost robot localization.
source_figure_height: 406
source_figure: assets/images/localization/lora-overview.png
source_figure_alt: Original research overview of four campus LoRa beacons, the wheeled research robot and learned signal-strength fields.
source_figure_caption: Original research overview from the authors' project materials. Each of four LoRa beacons has its own GP signal map. This source graphic is separate from the illustrative animation.
---

## The problem: affordable localization around buildings

GPS can become unreliable near buildings and covered walkways. Cameras, LiDAR and wheel encoders offer other navigation inputs, but their cost or platform assumptions may not suit every robot. This work explores localization using a LoRa receiver and a magnetometer, supported by four fixed beacons and a learned signal map.

The study used commodity LoRa hardware around a 16,000 m² area of BYU campus. LoRa supplies received-signal-strength indicators (RSSI); the magnetometer supplies heading. GPS and wheel encoders were used for training references and comparison experiments, rather than as inputs required by the proposed online configuration.

## Build a map for each beacon

A training survey pairs beacon strengths with reference positions. One Gaussian process (GP) per beacon models the spatial field and its uncertainty. A fitted logarithmic signal-decay function supplies a prior mean, and an RBF kernel relates nearby measurements. Sparse GP modeling reduces the burden of the collected dataset.

These are signal fingerprints, not perfect distance measurements. Buildings, fading and multipath make equal-strength regions irregular. During localization, the robot compares current RSSI values with the distributions predicted at candidate positions.

## Infer movement from signal history

The distinctive motion input comes from changes in RSSI. For each beacon, the system compares the current strength with recent readings to build similarity features. The paper uses a three-step history window and separate Gaussian mixture models (GMMs) for moving and stopped examples.

The classifier produces probabilities for those two classes. It does **not** predict an exact speed or displacement directly. A moving decision selects a nominal travel magnitude, and a stopped decision selects zero; magnetometer heading supplies direction. Confidence controls the noise used to sample motion, preserving more uncertainty when the decision is less reliable.

The animation's stop/resume control changes the illustrative robot's movement and signal history. A toy classifier explains the role of the published GMM, without pretending to run the trained classifier or its reported validation accuracy.

## Fuse motion and signal maps

The particle filter begins with candidate locations spread across the map. It propagates each candidate using the motion estimate, scores its agreement with the signal maps, then resamples according to those scores. When multiple beacon observations are available, their individual weight factors are combined before normalization.

Repeating these steps links relative motion with absolute signal fingerprints. It also represents ambiguity: similar signals can support multiple possible locations, and weak training coverage can leave the estimate uncertain or inaccurate.

## What was measured

The team collected roughly three hours of data at an average driving speed of 0.6 m/s, with RSSI sampled at 1 Hz. Four 915 MHz beacons surrounded the test area. RTK GPS paired signal readings with reference positions during data collection.

Testing excluded the evaluated segments from model training. On the first five segments, where adjacent prior coverage remained, the proposed motion-classifier configuration averaged **2.57 m RMSE** across repeated experiments. The comparable particle filter with wheel-encoder motion averaged **2.12 m**, and standalone GPS averaged **2.07 m**. These comparisons do not mean the LoRa method outperformed GPS everywhere.

## Coverage and GPS-obstructed tests

On three segments without adjacent prior training data, the RBF configuration averaged **6.74 m RMSE**, with substantial variation between segments. The map-boundary segment was especially difficult. This qualifies the headline result: under-three-meter performance depended on the evaluated conditions and training coverage.

A separate route around a building included covered walkways where GPS was unreliable. Because reliable reference positions were unavailable for much of that route, the paper measured deviation from an **approximated path**. Its reported 4.6 m figure is therefore not directly equivalent to the precisely referenced test-segment results. The experiment is useful evidence of operation under GPS obstruction, with that evaluation limitation preserved.
