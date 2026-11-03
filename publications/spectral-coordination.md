---
layout: publication-background
publication_slug: spectral-coordination
title: Spectrum Coordination Subprotocol — Research Background
permalink: /publications/spectral-coordination/
description: How an energy-coded coordination subprotocol communicates radio astronomy spectrum requests across WiFi, LoRa and LTE.
preview_caption: Illustrative coordination packet, RSSI decoding and receiver responses.
contribution_focus: Ashton's confirmed focus is the network-layer coordination subprotocol. Detailed individual contribution information will be added here.
---

## Start by asking nearby radios to cooperate

Radio astronomy receivers listen for signals far weaker than nearby wireless transmissions. This paper combines several ways to reduce that interference. The part emphasized here is the network-layer coordination subprotocol: an observatory-associated transmitter tells active radios which band it needs and for how long.

Coordination can happen proactively before an observation or reactively after interference appears. It reduces interference at its source when devices cooperate. It does not replace the paper's other mitigation techniques or guarantee that every nearby transmitter will respond.

## Use a capability different radios already share

WiFi, LoRa and LTE do not normally decode one another's packets. The subprotocol instead uses a simpler common capability: measuring received channel energy. A coordinating transmitter applies on-off keying (OOK), producing patterns that receivers can detect by sampling RSSI.

Pseudo-noise sequences make the symbols recognizable through correlation. The paper uses 63-chip m-sequences and their inverses to form a small symbol vocabulary. A receiver collects energy samples, correlates them against known patterns, and checks whether a valid symbol sequence arrives within the expected time.

This is an intentionally low-rate control channel. Its purpose is a short actionable request across different technologies, rather than replacing their normal data links.

## An eight-symbol request

The packet has two preamble symbols followed by six payload symbols:

1. A requested action duration.
2. Four symbols representing the center frequency in MHz.
3. A bandwidth symbol.

A symbol's meaning depends on its position in that packet. The animation uses a schematic example requesting 10 minutes, a center frequency of 2450 MHz, and 20 MHz of bandwidth. That represents 2440–2460 MHz; it is an illustrative example chosen for this explanation, not a replay of the paper's example or experimental trace.

The waveform illustrates one 63-chip pattern and the packet fields. It does not implement the full research receiver or claim that the depicted device responses occur at the animation's speed.

## What a receiver can do

The WiFi implementation uses Atheros ATH9K channel-energy readings and can disable its radio or switch away. The LoRa implementation exposes RSSI polling on a Pycom LoPy4 and sleeps for the requested interval. The LTE demonstration uses modified srsRAN software with software-defined radios operating in an ISM band, rather than transmitting on licensed cellular spectrum.

The experiment therefore demonstrates the coordination principle on three implemented receiver paths. It is not evidence that arbitrary unmodified consumer radios already implement this subprotocol. The paper describes the firmware or software access needed for each implementation.

## Keep the other mitigation layers in context

The full system also addresses transmitters that do not comply. It investigates a tunable analog notch filter for narrowband interference and true-time-delay Hadamard projection for wider-band interference.

Those layers must be described with their actual development status. The packaged notch filter developed leakage that made it unusable in that configuration. The Hadamard projection was demonstrated digitally because the intended analog delay chips were delayed. The integrated experiment reported suppression of a remaining noncompliant source while preserving a signal of interest; further assessment of signal-to-noise degradation was future work.

The animation's ignore/honor control illustrates this division of responsibility. Cooperation reduces the interference before cancellation; a noncompliant transmitter leaves work for downstream mitigation. It does not simulate the analog circuitry or reproduce a measured cancellation result.
