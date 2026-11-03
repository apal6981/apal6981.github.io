---
layout: publication-background
publication_slug: acoustic-localization
title: Acoustic Signal Localization — Research Background
permalink: /publications/acoustic-localization/
description: How acoustic signal-strength maps and sequential particle-filter updates estimate a vehicle's position in a shallow marina.
source_figure: assets/images/localization/acoustic-overview.png
source_figure_alt: Original research overview showing marina beacon locations, the WAM-V vessel and per-beacon signal maps.
source_figure_caption: Original research overview from the authors' project materials. Four acoustic beacon fields support localization of a WAM-V 8 with a submerged modem. This is source imagery, separate from the illustrative animation.
---

## The problem: navigating where GPS cannot reach

Underwater vehicles cannot rely on GPS the way surface robots can. Common acoustic positioning methods estimate range or bearing, often requiring two-way exchanges or synchronized clocks. Those requirements make it harder to support many independently localizing receivers.

This research asks whether received signal strength alone can provide a useful acoustic position measurement. The approach combines learned signal maps with motion information and a particle filter. It estimates two-dimensional position and heading; full three-dimensional underwater localization was future work.

## Learn each beacon's signal landscape

Four fixed acoustic modems provide distinct signal fields. Measurements collected at known locations train one Gaussian process (GP) per beacon. Each GP estimates the expected signal strength and uncertainty across the area. A fitted logarithmic signal-decay model provides the mean function, while an RBF kernel captures spatial relationships.

Shallow water complicates these fields. Signals reflect from the surface, seabed, docks and other structures, so a strength measurement is not an exact distance. The learned maps provide a way to compare observations with plausible locations without assuming clean circular range boundaries.

## Track possibilities rather than one guess

A particle represents a possible vehicle position and heading. The filter maintains many such hypotheses through three repeating stages:

1. **Motion:** commanded forward speed and a heading measurement move each particle, with noise representing uncertainty. The field experiment obtained heading from a dual-antenna GPS; the paper does not demonstrate an entirely GPS-independent heading sensor.
2. **Measurement:** the latest beacon's RSS is compared with that beacon's GP prediction at each particle. Agreement, normalized by model uncertainty, determines the weight.
3. **Resampling:** particles are sampled with replacement according to those weights, retaining more support in plausible areas.

Only one beacon's map enters each acoustic measurement update. The animation exposes these stages using a small educational particle filter over synthetic fields. It does not load the trained GPs, reproduce the paper's dataset or certify a localization error.

## One-way method, sequential experimental collection

The proposed localization method can use one-way beacon observations without synchronized clocks, time-of-flight ranging or bearing input. A receiver could therefore localize without transmitting its own position request.

The experimental setup is an important distinction: the four fixed modems were not networked, so the vessel's modem polled them sequentially. Approximately one measurement arrived every three seconds. The paper's scalable passive-receiver concept should not be confused with a demonstrated deployment of a fully passive multi-agent fleet.

## What was evaluated

The team deployed four SeaTrac X150 modems in a marina about 2–2.5 m deep. A fifth modem was carried roughly 30 cm below the surface on a WAM-V 8. Using a surface vessel enabled GPS reference positions for evaluation while collecting submerged acoustic measurements.

A grid mission supplied training data, and a separate waypoint mission supplied evaluation data. Evaluation data was excluded from GP training. With the same particle-filter framework, Table I reports a **17.4 m mean error** for the GP/RSS measurement update, compared with **21.3 m** for the bearing-only update. The corresponding reported standard deviations are 2.1 m and 2.3 m. These numbers describe this experiment, rather than a universal accuracy guarantee.

## What the result does—and does not—show

The experiment supports signal strength as a useful acoustic localization measurement in this shallow, cluttered environment. It does not establish sub-meter positioning, full 3D tracking, performance across all water conditions or large-fleet operation. Prior signal mapping and deployed beacons remain part of the infrastructure.
