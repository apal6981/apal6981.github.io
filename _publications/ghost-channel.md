---
order: 6
title: Side Channel Communications With Ghost Modulation Over the Asymmetric Binary Crossover Erasure Channel
authors: Daniel Harman, <strong>Ashton Palacios</strong>, Philip Lundrigan, Willie K. Harrison
venue: 61st Allerton Conference on Communication, Control, and Computing, 2025
year: 2025
summary: A theoretical view of how network delay and packet loss create asymmetric bit errors and erasures in Ghost Modulation.
about: Ghost Modulation places a low-rate secondary message in an existing stream's timing. This paper describes its signal and channel models, a decision rule based on simplified likelihood models, packet acquisition and synchronization, and short-block-code simulations. The illustration isolates the basic difference between a timing crossover and an erasure.
figure_family: engineering
figure: assets/figures/ghost-channel.png
fig: ghost-channel
fig_aspect: 16/9
fig_label: Each symbol has a zero slot, a one slot and a guard interval. A clean event stays in its slot; delay can move a zero event into the one slot, while packet loss or an unusable late event produces an erasure.
fig_caption: '<strong>A late event and a missing event are different errors.</strong> Compare clean timing, added delay, packet loss and multiple events. These simplified examples apply the supplied preprint’s per-symbol rule: a single event in a bit slot yields that bit; guard-only, missing or multiple events yield an erasure. The same delay can affect zero and one differently. This does not implement packet acquisition, synchronization or a coded bit-error-rate simulation.'
fig_illustrative: true
link: assets/papers/ghost-channel-arxiv.pdf
link_label: arXiv preprint (PDF)
paper_url: https://www.ideals.illinois.edu/items/137292
links:
- text: IDEALS repository
  url: https://www.ideals.illinois.edu/items/137292
- text: Research background
  url: /publications/ghost-channel/
---

The repository identifies this as a 2025 Allerton conference paper. Its published record remains linked through IDEALS. The local PDF is the author-supplied 2024 arXiv preprint under the earlier title An Information Theoretic Analysis of Ghost Modulation. The explanation here separates channel concepts from the broader LEO satellite demonstration.
