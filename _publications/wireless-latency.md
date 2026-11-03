---
order: 4
title: Wireless Latency Shift Keying
authors: Jacob Johnson, Cody Arvonen, <strong>Ashton Palacios</strong>, Philip Lundrigan
venue: ACM International Conference on Mobile Computing and Networking (MobiCom), 2024
year: 2024
summary: A low-rate channel lets an unassociated WiFi sensor convey data through controlled network latency.
about: Wireless Latency Shift Keying controls latency at a chosen wireless ping reflector while a trusted receiver measures response timing. Wicket uses this channel to receive sensor data without giving the sensor full WiFi association. Beacon synchronization and spreading codes make the low-rate signal recognizable amid ordinary network variability.
figure_family: engineering
figure: assets/figures/wireless-latency.png
fig: wireless-latency
fig_aspect: 16/9
fig_label: An unassociated sensor influences buffering at an access point for one ping reflector. A wired receiver measures the resulting reply bursts and interprets an eleven-chip pattern as a data bit.
fig_caption: '<strong>A small communication door, without full network access.</strong> Targeted buffering creates reply bursts that a trusted receiver can measure. The paper uses an 11-chip Barker spreading code for data and a separate 31-chip synchronization word. Toggle the data bit to see the spreading pattern invert. The diagram omits the synchronization word for clarity; traffic, burst heights and timing are illustrative, not a live network experiment.'
fig_illustrative: true
link: assets/papers/wireless-latency.pdf
link_label: Paper
links:
- text: ACM Digital Library
  url: https://dl.acm.org/doi/10.1145/3636534.3649373
- text: Research background
  url: /publications/wireless-latency/
---

The sensor remains outside the trusted network's normal association boundary. The published implementation exploits targeted WiFi power-saving behavior rather than indiscriminately delaying every device. The animation is an explanatory drawing and sends no network traffic.
