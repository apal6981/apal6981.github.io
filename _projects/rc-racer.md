---
order: 5
title: Self-Driving RC Racer
authors: <strong>Ashton Palacios</strong>, Derek Benham and another teammate
venue: Robotic Vision class, Brigham Young University
summary: Camera-based obstacle detection and lightweight path planning on a self-driving RC car.
figure_family: engineering
figure: assets/figures/rc-racer.png
fig: rc-racer
fig_aspect: 16/9
fig_label: An RC car navigates colored track boundaries and a cone. A camera view becomes an obstacle map with a planned steering path.
fig_caption: '<strong>From a camera frame to a steering decision.</strong> Colored boundaries and a cone are segmented into an obstacle map. A clearance-based path bends around the cone as the car follows a schematic track. Toggle the cone to compare the plans. This figure explains the team project at a high level; it is not the original controller, recorded race or a performance benchmark.'
fig_illustrative: true
about: A class team programmed an RC car to navigate a track with colored pool-noodle boundaries and traffic cones. The platform combined a RealSense camera and onboard Nvidia TX1 computing. Image processing separated colored obstacles from the driving area, and lightweight planning methods produced steering commands under limited computing capacity.
year: 2022
credit_note: Known collaborators shown; additional teammate credit to be added.
links:
- text: Demo
  url: https://www.youtube.com/watch?v=24IoHJpjovY&feature=youtu.be
- text: Project background
  url: https://drbenham.website/ecen_racer
---

The team compared navigation approaches and integrated their work into a racing system. The accompanying figure is an explanation of the perception-to-steering idea, not a reproduction of any teammate's individual implementation.
