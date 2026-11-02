---
order: 4
title: 3D Hand Reconstruction
authors: Derek Benham, <strong>Ashton Palacios</strong>
venue: Semester project, Brigham Young University
summary: From smartphone video to a detailed surface model and a printable keepsake.
figure_family: engineering
figure: assets/figures/hand-reconstruction.png
fig: hand-reconstruction
fig_aspect: 16/9
fig_label: Camera views surround an illustrative open hand. COLMAP camera poses and a bounding sphere guide Neuralangelo surface reconstruction, followed by cleanup and a schematic print.
fig_caption: '<strong>Camera poses guide a neural surface.</strong> Capture frames, solve camera poses with COLMAP, select the reconstruction region, then optimize a surface from coarse to fine before cleanup and printing. The sparse points help select the region; they are not directly converted into the Neuralangelo mesh. Geometry, cameras, progress and print layers are illustrative. Demonstrated prints in the report are adult-hand models, not completed newborn reconstructions.'
fig_illustrative: true
about: This semester project explored a pipeline for creating printable hand and foot keepsakes from short smartphone videos. COLMAP supplied camera poses and a sparse point cloud used to choose a bounding sphere. Neuralangelo then reconstructed a surface within that region, with Blender used to clean artifacts before FDM or SLA printing. Patterned backgrounds helped recover more reliable camera poses.
link: assets/3D_Reconstruction_of_Infant_Keepsakes_Report.pdf
link_label: Report
---

The report demonstrates printed adult-hand models and describes further toddler and newborn data collection. Newborn footage had not yet been processed at the time of writing. The project explored an idea for a keepsake service; it is not presented as a launched business.
