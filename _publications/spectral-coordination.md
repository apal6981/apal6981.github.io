---
order: 5
title: Network Layer Spectral Coordination Integrated With Hadamard Projection for Multilayer Interference Mitigation
authors: <strong>Ashton Palacios</strong>, Devon Ward, Dinah Bronson, Jon Backman, Deukhyoun Heo, Karl F. Warnick, Philip Lundrigan
venue: IEEE International Symposium on Dynamic Spectrum Access Networks (DySPAN), 2024
year: 2024
summary: An energy-detectable coordination subprotocol lets different radio technologies act on a radio observatory's spectrum request.
about: The network-layer subprotocol encodes requests in on/off channel energy and PN-coded symbols that receivers detect through RSSI correlation. WiFi, LoRa and LTE implementations demonstrate coordinated spectrum access. The broader paper combines this proactive coordination with downstream mitigation for noncompliant interference; this explanation emphasizes the coordination work identified by Ashton.
figure_family: engineering
figure: assets/figures/spectral-coordination.png
fig: spectral-coordination
fig_aspect: 16/9
fig_label: A coordination message is transmitted as on-off energy chips, decoded from RSSI into duration, center-frequency and bandwidth fields, and acted on by WiFi, LoRa and LTE receivers.
fig_caption: '<strong>One request, different radios.</strong> A coordinating transmitter encodes a spectrum request in energy that other radios can measure. The protocol uses 63-chip symbols and an eight-symbol packet. Here the example requests a 20 MHz band centered at 2450 MHz for 10 minutes. Compliant devices switch away or pause; ignored requests leave interference for the other mitigation layers. Waveforms, response timing and this internally consistent example request are illustrative, not recorded measurements.'
fig_illustrative: true
link: assets/papers/spectral-coordination.pdf
link_label: Paper
links:
- text: IEEE Xplore
  url: https://ieeexplore.ieee.org/document/10632837
- text: Research background
  url: /publications/spectral-coordination/
---

Ashton's confirmed focus is the coordination subprotocol. The full paper credits the network, analog and digital mitigation work across its author team. Detailed individual responsibilities can be added to the research page later.
