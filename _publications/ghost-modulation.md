---
summary: Identifying interfering transmitters through a watermark in transmission timing.
order: 1
title: 'Hidden in Plain Sight: Communicating using Interference'
authors: <strong>Ashton Palacios</strong>, Daniel Harman, Christopher Kitras, Elle Kelsey, Mitchell C. Burnett, Willie K. Harrison, Philip Lundrigan
venue: IEEE International Symposium on Dynamic Spectrum Access Networks (DySPAN), 2025
year: 2025
figure: assets/figures/ghost-modulation.png
link: assets/GM_v2.pdf
links:
- text: Stealthy Signals — local PDF
  url: assets/papers/stealthy-signals.pdf
  note: "2023 LEO-NET workshop paper; complete original author credits are preserved in the PDF"
- text: Stealthy Signals — workshop paper
  url: https://dl.acm.org/doi/10.1145/3614204.3616105
  note: "Stealthy Signals: Using Ghost Modulation to Watermark Interference"
- text: IEEE Xplore
  url: https://ieeexplore.ieee.org/document/11115916
  note: Published version
link_label: Paper
fig: ghost-modulation-sky
fig_aspect: 16/9
fig_label: Three LEO satellites, in teal, terracotta and blue, cross the sky above a radio telescope. Sat A's sidelobe sweeps over the dish and a burst of interference ruins the observation. From the burst's transmission timestamps alone, the observatory reads a one-time code that matches the current minute and an ID naming Sat A. In the replay attack, an attacker on the ground replays Sat B's watermark recorded three minutes earlier; the ID still decodes, but the one-time code has expired, so the observatory rejects it.
fig_caption: <strong>Who ruined the observation?</strong> The main antenna lobe serves a separate user terminal; smaller off-axis sidelobes sweep past the observatory. Unintended sidelobe energy drowns the telescope's faint source, and the observatory names the culprit from transmission timestamps alone, without demodulating anything. Each watermark carries a 16-bit one-time code from a seed the satellite and observatory share, valid for one minute. Press <em>Show a replay attack</em> and Eve records Sat B's watermark, then replays it three minutes later to frame Sat B; the code has expired, so the observatory rejects it. The code length, one-minute slice and timing-only decode are from the paper; satellite paths, burst timing and code values are made up.
fig_illustrative: true
abstract: Radio astronomy observatories examine the universe by capturing faint RF signals from space. The equipment to capture these signals is extremely sensitive, and nearby transmitters, such as LEO satellites, cause destructive interference. We propose the Spectra watermarking protocol to add an identifying fingerprint to these interfering transmitters. Spectra changes the timing of key transmissions to encode identifying information that can be decoded by examining transmission timestamps and without having to demodulate the actual transmission. We implement multiple forward error correction codes for Spectra to account for dynamic LEO satellite channels. We evaluate Spectra and show that it can operate over highly variable channels with low BER while preserving the network performance of the interfering device.
---

The related **Stealthy Signals: Using Ghost Modulation to Watermark Interference** workshop paper (LEO-NET 2023) is by **Ashton Palacios**, Chase Bledsoe, Elle Kelsey, Laura Landon, Jon Backman and Philip Lundrigan. Its local PDF and ACM record are linked above; these are the workshop paper's credits, distinct from the later publication.
