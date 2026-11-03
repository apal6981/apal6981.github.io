---
layout: publication-background
publication_slug: wireless-latency
title: Wireless Latency Shift Keying — Research Background
permalink: /publications/wireless-latency/
description: A high-level explanation of latency modulation and Wicket's low-rate path from an unassociated sensor to a trusted receiver.
preview_caption: Illustrative access-point buffering, reply bursts and data spreading.
---

## A narrower way to receive sensor data

Joining a normal WiFi network gives a device a broad communication capability. Some inexpensive sensors need much less: a way to report small readings to an application willing to receive them. Wireless Latency Shift Keying (LSK) explores conveying those readings without associating the sensor with the trusted network.

Wicket is the paper's application of that modulation. A trusted receiver runs the receiving application, while the sensor stays outside the normal WiFi association boundary. This is not equivalent to granting the sensor the network password or unrestricted access to other hosts.

## Three roles, with an access point between them

The transmitter is an unassociated wireless device. The receiver measures latency from inside the trusted network; the demonstrated wired receiver also shows communication across Ethernet and WiFi. A wireless ping reflector supplies ordinary responses without needing to understand LSK.

The transmitter affects the access point's buffering behavior for that reflector. The paper compares several ways to induce delay and chooses targeted WiFi NULL-frame behavior to limit the effect to one device. The animation shows the resulting buffering concept, not a working packet injector or a direct application-data connection from the sensor.

## Turn delay into something measurable

During a controlled buffering interval, responses are held and then released together. Rather than decoding only a triangular round-trip-latency trace, the published receiver detects the sharper concentration of arriving replies per time bin.

WiFi beacon frames supply synchronization boundaries, helping avoid premature release of buffered traffic. The paper uses parallel probes so an unanswered request does not stop the receiver from sampling the next interval. The receiving implementation measures TCP response timing; the reflector remains unaware of the secondary channel.

## Spread a bit across several intervals

LSK uses a 31-chip maximal-length synchronization word and an 11-chip Barker code for data. A one sends the spreading code; a zero sends its inverse. High-latency and normal-latency intervals encode the chips, and correlation helps distinguish the pattern from unrelated traffic variation.

The animation isolates one data bit and its eleven-chip pattern. It deliberately omits the synchronization word and uses illustrative timing. At the paper's one-chip-per-102.4-ms-beacon setting, the data encoding corresponds to roughly 0.89 bits per second before considering additional packet overhead. That low rate fits periodic small sensor readings, not ordinary high-rate WiFi traffic.

## What the evaluation supports

The paper evaluates Wicket using three router models, changing network load, wireless signal strength and up to four simultaneous transmitters. Its controlled tests demonstrate that the channel can work with commodity devices and typical home-network traffic, with increasing congestion or weak transmitter reception limiting performance.

The evaluation also measures network impact. It reports about one percentage point of additional channel utilization for a single transmitter/receiver configuration, and an increased average latency at the selected reflector. These are results for the tested setup, not a claim that the channel has zero cost or works on every current network configuration.

## Security scope

Wicket gives a receiving application a low-rate path from a sensor rather than a full network association. Protecting the received data and hardening that application still matter. The paper discusses confidentiality, integrity and availability separately; the existence of the modulation itself is not a universal security guarantee.
