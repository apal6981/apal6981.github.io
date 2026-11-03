---
layout: publication-background
publication_slug: ghost-channel
title: Ghost Modulation's Asymmetric Channel — Research Background
permalink: /publications/ghost-channel/
description: A conceptual explanation of timing crossovers, erasures and asymmetry in the Ghost Modulation channel.
preview_caption: Simplified per-symbol examples of clean timing, delay, packet loss and ambiguous multiple events.
local_paper_label: Read the arXiv preprint (PDF)
paper_version_note: "Local PDF: the 2024 preprint An Information Theoretic Analysis of Ghost Modulation. The IDEALS link leads to the 2025 Allerton publication record."
---

## Study the channel behind the timing message

Ghost Modulation adds a low-rate message to an existing network stream by adjusting timing. This paper develops a theoretical signal/channel description, packet acquisition and timing synchronization, and coded simulations. Its official record is hosted in the Illinois IDEALS repository.

## Different observations require different decisions

The symbol illustration has a zero slot, a one slot and a guard interval. An event's observed position can change under network delay. Packet loss can instead remove evidence entirely.

Those effects motivate distinguishing a **crossover**, where a received bit differs from the sent bit, from an **erasure**, where the receiver cannot produce a usable binary observation. Missing evidence should not simply be treated as a zero.

## Why asymmetry matters

The two sent values need not have identical error behavior. A delay can shift an earlier event into a later bit slot, while shifting a later event into a guard or beyond the relevant window. This is a conceptual way to understand why an asymmetric channel model is useful.

The animation makes those cases visible using schematic event times. Its fourth case adds multiple events, showing why a decoder should sometimes decline to guess. It does not reproduce measured network traffic.

## A simple decision rule that can decline to guess

The supplied preprint's heuristic examines each symbol period independently. If exactly one event appears in the period and falls in the zero slot, the output is zero. If that lone event falls in the one slot, the output is one. A guard-only event, no event or multiple events yields an erasure.

This is deliberately simpler than solving for the most likely complete transmitted sequence. Longer delays can reorder arrivals and make packet correspondence ambiguous; the paper models that difficulty rather than assuming every event can be assigned perfectly.

## Find the start before decoding

The receiver also needs to detect a message and align its symbol slots while ordinary network traffic continues. The preprint builds a detection metric from a known preamble shaped by an exponential-delay model. Binning arrival times makes that metric computable, with a tradeoff between timing resolution, memory and computation.

A detection peak provides a candidate message start and slot alignment. This is distinct from synchronizing computer clocks through a protocol such as NTP: the side-channel receiver cannot modify the primary packets to add timing information.

## What the coding results describe

The preprint evaluates short Reed–Muller and Hamming codes in simulated delayed/dropped-event channels. Those results depend on the modeled delay distribution, symbol/guard timing, drop probability and code choice. They are not a universal measured error rate for arbitrary Internet traffic.

The animation implements only the small per-symbol examples above. It does not run the acquisition algorithm, estimate channel capacity or reproduce the coding-performance curves.

## Preprint and published record

The locally hosted PDF is the 2024 arXiv preprint **An Information Theoretic Analysis of Ghost Modulation**, supplied by the owner as the accessible version of this work. The **IDEALS repository link** is retained for the 2025 Allerton record under the publication title shown above. These are labeled as separate versions rather than represented as byte-identical documents.
