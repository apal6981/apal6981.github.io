# Ashton Palacios portfolio — implementation plan

## Status and authorization

This document records the finalized planning decisions from the November 2026 session. Website implementation and local verification were subsequently explicitly authorized on November 1, 2026. The user subsequently authorized local commits after verified substantial additions. Push and publication remain unauthorized. The local implementation follows this specification.

## Purpose and success

Create an elegant personal portfolio primarily for engineering employers. Build the foundation before the owner supplies biography, employment history, and other personal details. Use a single scrolling page with every planned section visible, including clearly labeled placeholders for missing information. Match the reference's level of craft while establishing an independent identity.

Confirmed owner/display name: Ashton Palacios. Confirmed direction: ivory, charcoal, copper; original composition; reuse the friend's actual interactive graphics; code-first implementation with browser review. No mockup-first requirement.

## Environment and inspected baseline

- Project root: `C:\Users\pista\OneDrive\Documents\palacios_ashton_website`.
- Reference clone: `C:\Users\pista\OneDrive\Documents\christopolise.github.io`.
- Reference live site: https://kitras.dev/ . Source: https://github.com/christopolise/christopolise.github.io . Network access failed during planning; the local clone was successfully inspected.
- Target is a default Jekyll 4.4.1 / Minima 2.5 starter, including a welcome post and About page. Most starter files were untracked; preserve unrelated user work and recheck state before edits.
- Ruby 4.0.9 and Bundler 4.0.23 were installed; `bundle check` passed. A complete build and rendered review have not yet been performed.
- No Git remote was configured at inspection. Git reported different directory ownership. Read-only inspection succeeded with `git -c safe.directory=C:/Users/pista/OneDrive/Documents/palacios_ashton_website ...`; avoid changing global Git configuration as a side effect.
- Installed design skill: `.agents/skills/impeccable/SKILL.md`, version 4.8.0 at inspection. Its context command was run during planning. No PRODUCT.md or DESIGN.md existed. Read applicable skill instructions in a fresh session; do not assume its workflow substitutes for user authorization.

## Page structure and content behavior

Use this order, with stable anchor navigation to each section:

1. Introduction: name, short factual introduction to selected work, space for biography/portrait, future resume/social links, theme control.
2. Projects: Interactive Underwater Acoustic Simulator with Ray Tracing; WiLiE.
3. Publications: Hidden in Plain Sight: Communicating using Interference.
4. Posters: SSS: Building a Seven Segment Sign.
5. Research and current work.
6. Experience and education.
7. Teaching.
8. Awards and skills.
9. Contact/footer.

All sections MUST remain visible even when empty. Use understated text such as “Experience details to be added” with realistic section spacing. Do not hide their navigation links. Unavailable resume/social/contact destinations are plain explanatory text, not dead links or disabled buttons. Missing portrait space can use a quiet labeled placeholder, never a fabricated headshot. Adding real data replaces placeholders without template changes.

Work entries show a title, concise project-level summary, authors, venue/year, graphic preview, and available resources. Use native expandable details for fuller descriptions and interactive figures. Support deep links that open the corresponding work. Preserve complete author order and shared-credit markers; emphasize Ashton rather than Christopher. Never invent Ashton's individual responsibilities or credentials.

## Architecture and interfaces

- Retain Jekyll 4.4.1; replace Minima presentation with custom Liquid layouts/includes and plain CSS. No React, Bootstrap, Tailwind, chart library, Node build pipeline, or backend.
- Collections: `projects`, `publications`, `posters`, each with `output: false`. One Markdown document per work; no standalone work pages in v1.
- Front matter carries title, authors, venue, year, explicit order, resource links, figure ID/aspect/accessible label/caption/illustrative flag, and static fallback image. Markdown body holds descriptions. Keep source-compatible field names where practical; document any renamed fields.
- YAML data holds identity, optional links, biography, current work, experience, education, teaching, awards, skills, and section ordering. Empty values render visible placeholders, not fabricated content.
- Reusable Liquid components: base/head layout, homepage, navigation, section headings, work entry, resource links, figure, theme control, empty-section treatment, timeline/resume rows, footer. A generic page layout supports the styled 404.
- Use CSS custom properties for colors, type, spacing, widths, borders, and figure tokens. Separate shared figure runtime from the four figure definitions and small site/theme behavior.
- Load only the figure scripts referenced by published entries, once each. Keep all important text/resources accessible without JavaScript.
- Add appropriate title/description metadata, initial-based favicon and styled 404. Remove default welcome-post/About content from published output. No blog/feed requirement; retain only needed plugins, including `jekyll-seo-tag` if used.
- Exclude this plan, AGENTS.md, PRODUCT.md, DESIGN.md, skills, local configuration, caches and generated output from publication. Do not commit generated `_site` output. Document updating content, adding works, previewing and deployment.

## Reference technology and exact content sources

The reference is custom Jekyll (4.3.x there), Liquid, plain CSS and vanilla JavaScript. Figures use Canvas 2D and `Fig.register`, not SVG animation or a third-party graph framework. Inspect these files in the reference clone:

| Work | Metadata/content | Figure definition |
|---|---|---|
| Hidden in Plain Sight | `_publications/ghost-modulation.md` | `assets/js/figures/ghost-modulation-sky.js` |
| SSS | `_posters/sss.md` | `assets/js/figures/sss-pixels.js` |
| Acoustic simulator | `_proj/bellhop.md` | `assets/js/figures/bellhop-rays.js` |
| WiLiE | `_proj/willie.md` (note spelling) | `assets/js/figures/wilie-survey.js` |

Shared dependencies: `assets/js/figures/kit.js`, `_includes/fig.html`, `_includes/work-item.html`, `assets/js/site.js`, and CSS tokens in `assets/css/site.css`. Reference `DESIGN.md` documents its own identity; consult as evidence, do not import as Ashton's identity.

Copy only selected work assets and dependencies. Referenced documents include `assets/GM_v2.pdf`, `assets/SSS_poster.pdf`, `assets/opengl_bellhop.pdf`, `assets/opengl_bellhop_presentation.pdf`, `assets/WiLiE.pdf`, and `assets/WiLiE_Presentation.pdf`. Source entries contain authoritative code/docs/demo links. Static assets include gm/sss/bellhop SVGs and bellhop/WiLiE images; choose accurate fallback illustrations from these. Resolve and verify every resource path rather than copying the whole assets folder.

The user explicitly confirmed permission to adapt the friend's website graphics/code with no attribution required. No repository license file was found during inspection; do not describe it as publicly licensed. Preserve existing applicable notices and research authorship. Do not copy Christopher's portrait, biography, CV, contact details, analytics ID, CNAME, or unrelated work.

## Visual design system

- Light: ivory background `#F7F3EC`, charcoal text `#242321`, copper accent `#944A2D`.
- Dark: charcoal background `#1D1C1A`, warm ivory text `#F0EAE0`, copper accent `#E5A17C`.
- Georgia for name/major headings; system sans-serif for body/controls; system monospace for technical labels. No external font service. Adapt the runtime's hardcoded Geist font helpers to these tokens.
- Body approximately 17–18px; comfortable line height and reading measure. Desktop container around 72rem. Use generous whitespace, thin rules and restrained corners; artifacts lead, without excessive card decoration.
- Desktop pairs prominent graphic previews with text. Below tablet width, stack content and graphics vertically. Navigation wraps naturally. Empty sections receive the same deliberate hierarchy and spacing.
- Retain distinct secondary figure colors and semantic success/error colors. Check actual contrast in both themes; palette hex values are the starting tokens, not evidence of passing contrast.
- Theme control cycles System / Light / Dark. Initial mode follows OS; persist explicit preference, apply before first paint, handle unavailable storage, and redraw figures on theme changes.

## Figure behavior and accessibility

Reuse the four actual figures: interference/replay attack; seven-segment ring/wave; acoustic profile switching; LiDAR survey/antenna switching. Preserve their explanatory, illustrative character, not claims that they are measured simulations or new project results.

Shared kit already supports responsive HiDPI sizing, theme colors, viewport observation, playback controls and reduced-motion stills. Preserve these capabilities while adapting the UI. Previews are still by default; opening details enables the full figure with play/pause/restart and its specific controls. Pause closed/offscreen figures. Reduced motion defaults to meaningful stills. Provide static fallback images and captions for no-JS/Canvas failure. Text and resource links must never depend on canvas rendering.

Use semantic headings/landmarks, skip link, native disclosures, labeled controls and visible focus. Deep links open work disclosures without breaking section navigation. Avoid duplicate figure controls after repeated opening/replay. Ensure one failing figure does not stop the others. Honor mobile readable geometry and labels rather than merely shrinking desktop canvases.

## Jekyll / GitHub Pages constraints and workflow

- Publish static output through GitHub Actions, not GitHub's constrained branch-build gem stack. Keep Jekyll 4.4.1 and the lockfile; use compatible pinned Ruby/Bundler versions, and include Linux lockfile support for CI where necessary.
- No custom server or runtime services. Resolve internal resources with `relative_url` / `absolute_url` and configure `url` / `baseurl` correctly for user sites, project sites or custom domains.
- Local commands: `bundle install`, then `bundle exec jekyll serve`; preview at http://localhost:4000 . Restart after configuration changes.
- Production validation: `bundle exec jekyll build --strict_front_matter` with production environment. Validate both empty and nonempty baseurl.
- CI builds pull requests. Production deployment starts manually via workflow dispatch, uploads the Pages artifact, and deploys through the GitHub Pages environment with appropriate minimal permissions. A source push must not silently publish the first implementation.
- Own repository URL and public address are required before deployment. Default to GitHub's Pages domain unless a custom domain is supplied. No production deployment is authorized by this planning document.
- Official workflow references: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages and https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll . Recheck current action versions when implementing.

## Implementation phases (after explicit authorization)

1. **Baseline and design records:** reread this plan and project instructions, inspect current changes, load Impeccable, record confirmed context in PRODUCT.md/DESIGN.md as applicable. Preserve existing work. Establish code-first design tokens and component conventions.
2. **Jekyll foundation:** configure collections/data, base/home/page layouts, reusable includes, visible section placeholders, metadata, navigation, exclusions and 404. Remove starter presentation without deleting unrelated files.
3. **Four works and graphics:** migrate selected content/assets, normalize author emphasis, integrate kit and four definitions, theme/font mapping, native disclosures, deep links, fallbacks and playback lifecycle.
4. **Responsive visual implementation:** finish typography, page rhythm, desktop/mobile layouts, theme persistence, keyboard/focus behavior and placeholder composition. Add no speculative personal claims.
5. **Verification and documentation:** build, inspect rendered desktop/mobile and both themes, apply relevant Impeccable review, fix material defects, document editing/preview/deployment. Add CI and manual Pages workflow; validate without publishing.
6. **Review and release:** present implementation and validation results to owner. Obtain deployment destination and release authorization before external publication. Deferred personal content does not block local foundation completion.

## Acceptance checklist

- Every planned section and navigation anchor is visible. Empty sections show truthful placeholders; populating data replaces them without template edits.
- Four works have accurate titles, authors, years/venues, resource links and illustrative captions. No unrelated personal information is imported.
- Inspect widths 375px, 768px and 1440px in both themes: no page overflow, clipped content or unreadable diagram labels.
- Verify keyboard access, disclosure semantics, deep links, accessible controls, focus and WCAG AA text contrast.
- Verify no-JS fallback, Canvas failure fallback, reduced motion, unavailable storage and OS/theme changes.
- Verify profile/shape/attack/antenna controls, pause/restart, repeated open/close, resize and offscreen behavior without duplicate controls or console errors.
- Verify production build, root and subpath asset URLs, local PDF availability, and exclusions. Do not claim external links were verified if network access prevents it.
- Run meaningful checks appropriate to this static site; avoid an unnecessary heavy test framework. Report untested browser/deployment behavior honestly.

## Deferred inputs

No additional personal material is needed to implement the foundation after authorization. Biography, portrait, resume, social/contact destinations, role-specific contributions and optional section data can arrive later; maintain their visible placeholders. GitHub repository URL and final hosting address are needed before deployment.

## Approved revision - November 1, 2026

The user subsequently requested ATP in the header, sticky navigation while scrolling, SSS moved into Projects, and removal of the Posters and Teaching sections and navigation links. These changes supersede the corresponding original section requirements above. All remaining planned sections retain visible placeholders. SSS keeps its poster resource, complete credit and interactive figure. Navigation indicates the current section and offsets anchor scrolling by the measured header height.

## Additional school projects - source review in progress

The user approved the following four animation concepts. Website implementation for this addition remains pending completion/review of the source details; do not treat concept approval as approval of unverified facts.

- 3D Hand Reconstruction: hand-shaped point cloud resolving into a rotating surface, with a reconstruction-stage control. Only the source homepage summary is currently retrieved; exact method, date, detailed page and paper links remain unresolved.
- Self-Driving RC Racer: car navigating track boundaries and cones, with obstacle map and steering direction. Source: https://drbenham.website/ecen_racer (March 2022).
- Visual Odometry: matched features between camera frames and a building estimated trajectory, with adjustable illustrative drift. Source: https://drbenham.website/vo (April 2022; offline monocular SIFT-based estimation).
- Robot Baseball Catcher: stereo observations triangulating a ball, predicted intercept and moving catcher. Source: https://drbenham.website/baseball_catcher (February 2022).

User-supplied demo destinations, November 1, 2026:

| Project | Exact supplied URL |
| --- | --- |
| Visual Odometry | https://www.youtube.com/watch?v=fXM8YLXXC4w |
| Robot Baseball Catcher | https://www.youtube.com/shorts/FXYg8f1PFv4 |
| Self-Driving RC Racer | https://www.youtube.com/watch?v=24IoHJpjovY&feature=youtu.be |

Browser retrieval of all three YouTube destinations failed; the URLs are supplied by the user and are not claimed independently verified or playable. Preserve them as resource links when implementing. Paper/report links for these four projects remain unverified. Derek's first-person contribution descriptions must not become Ashton's claims. Racer/catcher source pages describe three-person teams; complete team names remain unresolved. Use original Canvas figures within the existing shared kit, explicit illustrative captions, static fallbacks and existing accessible controls. No source text/media copying beyond authorized scope; no publishing authorization.

### Hand-reconstruction report supplied

The user supplied https://drbenham.website/3D_Reconstruction_of_Infant_Keepsakes_Report.pdf and explicitly authorized reading, copying and linking the report on the portfolio. Web retrieval and direct local download failed in this environment; no PDF was downloaded, no report content was read, and no method/authorship claims are verified yet. Read the actual report before refining the approved hand animation and implementing its project entry. Preserve the report's original authorship. A locally supplied PDF can resolve the access failure. Do not represent the report as already copied or validated.

### Hand report read and validated locally

The user's successful download was located at `%TEMP%/infant-keepsakes-report.pdf` (2,683,621 bytes, seven pages). The full text was read using installed Poppler; figures on pages 1 and 4 were visually inspected. A byte-identical copy is staged in `.codex/source-material/3D_Reconstruction_of_Infant_Keepsakes_Report.pdf` (excluded from publication). The public asset/link will be added during project implementation.

Confirmed title: **3D Reconstruction of Infant Keepsakes using Deep Neural Networks**. Authors, in order: **Derek Benham and Ashton Palacios**. Affiliation: Brigham Young University. No publication year is stated on the title page; do not infer a project date from cited works.

Verified pipeline (sections III-IV): short smartphone video; COLMAP solves camera poses and generates a sparse point cloud; the point cloud is used to select a bounding sphere, not directly transformed into the final surface; Neuralangelo reconstructs a surface through coarse-to-fine optimization; Blender cleans artifacts; FDM/SLA printing produces physical models. Patterned backgrounds improved pose recovery. Successful demonstrated prints are adult-hand models. Toddler footage was collected, and newborn hand/foot videos were not processed at the time of the report. Do not claim a successful newborn reconstruction or a launched business. NeuS/NeuS2 discussion is not evidence those methods were successfully implemented.

Refined proposed animation: orbiting camera frustums around an illustrative adult fist and textured capture plane; sparse SfM points and a selectable bounding sphere; transition to a separately represented coarse surface, then finer surface detail; cleaned printable model and a schematic layer-by-layer print. Stage controls: Capture / Camera poses / Neural surface / Print. Avoid suggesting the COLMAP points are directly meshed by Neuralangelo. Camera layout, geometry and training progress are illustrative, not actual recovered model data or a real-time training benchmark. Preserve the approved rotating model concept and the existing figure kit's controls, still preview, reduced-motion fallback and accessible captions.

Final addition scope for user review: these four new Projects only; existing Projects/Publications and sticky ATP navigation preserved; three exact user-supplied video links retained; hand report copied to a public asset and linked as Report during implementation. Unnamed additional teammates on racer/catcher remain unresolved and must not be silently omitted through a false complete author list. Use explicit known-collaborator credit with additional team credit pending. No claim is made that YouTube playback has been independently verified. Await the user's implementation go-ahead after presenting this refined, source-validated plan.

### Implementation and commit authorization

After making the initial commit, the user explicitly authorized implementation of all four additional projects and requested commits after large additions. This supersedes the pending-implementation language above. Commit the verified four-project addition locally; no push or deployment is authorized.

### Four-project implementation outcome

All four new project entries and original Canvas explanations are implemented, bringing Projects to seven entries and preserving the existing publication. The hand report is a public local resource; exact video destinations are preserved. Four canonical PNG stills provide no-JS/Canvas fallbacks. The runtime gains opt-in mobile aspect ratios; existing figures retain previous sizing. Full figures are tested at 375/768/1440 in both themes, with stage/cone/drift/pitch controls and repeat-cycle checks. See VALIDATION.md for evidence and outstanding external-link/CI limits.

### Approved hand refinement

The user requested a more recognizable hand mesh and removal of the external Original report link. Replace the initial fist assembled from ellipsoids with one continuous illustrative open hand, including palm, four fingers, thumb and wrist. Preserve the four-stage pipeline and explain that it is designed geometry rather than a recovered model. Use smooth surface shading, update the static hand fallback, and retain only the local Report resource. This revision is authorized for local implementation and a checkpoint commit under the standing commit instruction.


### Approved catcher refinement and local background

The owner corrected the catcher explanation: a head-on projection isolates left/right movement as the ball approaches, and a side projection shows elevation. Two models account for these components and combine into the XY intercept. The revised original Canvas figure synchronizes both views, grows the head-on ball during approach, and moves the catcher to the same predicted coordinates. Three pitch variants, static previews and reduced-motion stills are retained. Paths, samples and timing remain explicitly illustrative.

The owner authorized a local `/projects/baseball-catcher/` background page like the Racer. Curl retrieved the full authorized source page and four original images from `drbenham.website`. The draft covers stereo calibration/detection, two model components, coordinate transformation, reported catchable-pitch results and computational tradeoffs. Derek's Kalman/Gaussian-process experiments remain credited separately; no individual role is invented for Ashton. Complete third-teammate credit remains pending. The shared background layout now accepts page-specific gallery, demo label and preview caption while retaining Racer defaults. The supplied YouTube destination is preserved without opening it.

Strict root/subpath builds and local resources/anchors pass. Playwright/Chromium checks at 375/768/1440 in both themes cover synchronized models, all pitch targets, gallery decoding, repeat controls, return navigation, no-JS fallback, reduced motion, Racer layout regression and no JavaScript errors. Selected mobile/desktop/tablet screenshots were visually inspected. Browser execution uses the owner's approved command-scoped exception; no sudo, system configuration changes, installation, push or deployment occurred during this revision.


### Catcher perspective correction — supersedes the side-view animation

The owner rejected the previous side-view explanation. Both stereo cameras face the pitcher and watch the same approaching ball, observing lateral and vertical motion together. The revised figure shows two head-on stereo frames and a head-on catcher with a ball that grows as depth decreases. Separate lateral and elevation models derive from those same reconstructed positions; their small plots are coordinate-versus-time graphs, not camera views. Their predictions guide one XY catcher target. Keep the source Gaussian-process side-view plot only as the explicitly credited experimental artifact in the background gallery.


### Approved acoustic and LoRa publications — November 2, 2026

The owner approved adding two coauthored papers from Derek's publication listing: One-Way Acoustic Signal Localization using Received Signal Strength (OCEANS 2025 Great Lakes) and Low-Cost Urban Localization with Magnetometer and LoRa Technology (IROS 2024). Add both to Publications, with original illustrative Canvas explanations, separate local high-level research pages, locally hosted unchanged PDFs, full author order and Ashton emphasized. Explain the shared research and include an Individual contributions placeholder for future owner edits. This extends the earlier standalone-page exception to these publications. Existing works remain present. No push or publication authorized.

Approved concepts: acoustic top-down marina with four beacons and a particle filter; motion from commanded speed/heading, a sequential single-beacon RSS update and weighted resampling. LoRa campus robot with four beacons; signal-history moving/stopped classification and magnetometer heading inform motion, then signal maps update position. Stop/resume and filter-step controls expose the distinction. Both use synthetic fields and educational particle-filter computations, not trained GPs/GMMs, original datasets or simulated reproductions of published accuracy.

The actual papers were downloaded from the approved drbenham.website host, read for method/results and copied byte-for-byte into assets/papers. Original overview graphics from the same host accompany the deeper pages. Exact paper author order is retained. Acoustic caveats: two-dimensional experiments used a surface WAM-V with submerged modem, GPS reference/heading and sequential modem polling; the proposed one-way measurement method is distinct from the implemented polling setup. Table I reports 17.4 m mean RSS error versus 21.3 m bearing-only. LoRa: moving/stopped classification rather than direct distance regression; 2.57 m RMSE on five adjacent-prior-data segments, 6.74 m across three without adjacent coverage. The building-route experiment uses an approximated path, not reliable full-route ground truth.

Implementation uses two collection documents, a reusable publication-background layout, two research pages and shared localization.js figure support loaded once before the two definitions. Contributions remain placeholders; no individual claims are invented. PDFs remain local resources; no external publisher/repository lookup was required.


### Publication animation pacing refinement

The owner requested faster acoustic and LoRa animation playback. Both now advance each filter stage every 0.3 seconds instead of 1.2 seconds, reducing a complete cycle from 3.6 to 0.9 seconds. Only these figures change speed. Step, play/pause and stop/resume controls remain available. Signal-map rendering is cached until the active beacon, figure dimensions or theme changes. Reduced-motion/thumbnail timing is retimed to preserve the previous still state.


### Stationary cloud, satellite sidelobes and publisher links

The owner requested a stable/tightening LoRa particle cloud while stopped, more spread on resuming motion, a clearer LEO sidelobe-interference illustration and IEEE links for the localization papers. Stopped-class motion hypotheses now use very small process jitter, allowing continued signal weighting/resampling to concentrate the cloud; moving hypotheses regain larger uncertainty. The synthetic classifier and field limitations remain explicit.

The LEO illustration now distinguishes a main antenna lobe serving a separate user terminal from smaller off-axis sidelobes. The interfering lobe has a fixed angular offset from the antenna boresight and sweeps past the dish; no normal-pass cone or identification connector is aimed at the observatory. Outgoing arc wavefronts represent sidelobe leakage. Eve's ground replay remains a distinct directed attack. Mobile geometry is taller for the explanatory labels. The updated local PNG fallback replaces the older SVG as this entry's displayed still without deleting the original asset.

Owner-supplied publisher URLs are added to homepage resources and local research pages: LoRa `https://ieeexplore.ieee.org/document/10801786`; acoustic `https://ieeexplore.ieee.org/document/11245189`. The user explicitly authorized these external destinations. IEEE blocked metadata retrieval with a JavaScript/robot-verification page or inaccessible response, so the destinations are preserved as supplied and not described as independently verified. Local PDFs remain available. No push or publication authorized.


### Three additional communications publications — November 2–3, 2026

The owner authorized implementation of Wireless Latency Shift Keying (ACM MobiCom 2024), Network Layer Spectral Coordination Integrated With Hadamard Projection for Multilayer Interference Mitigation (DySPAN 2024), and Side Channel Communications With Ghost Modulation Over the Asymmetric Binary Crossover Erasure Channel (Allerton 2025). Add original illustrative animations, separate local research pages and paper resources, preserving complete author order. Emphasize the coordination subprotocol in the multilayer paper because the owner identified that as his area of work. Other detailed individual contributions remain placeholders. Add Stealthy Signals: Using Ghost Modulation to Watermark Interference (LEO-NET 2023) as an additional paper on the existing LEO entry, with its own complete author credits.

The owner explicitly approved source access to the supplied ACM, NSF, Illinois and IEEE URLs, then supplied https://net-byu.github.io/papers/ as an additional approved author-hosted source. ACM and Illinois downloads returned HTTP 403. The lab listing supplied WLSK.pdf and stealthy-signals.pdf, both successfully downloaded, read and copied unchanged into assets/papers. The multilayer PDF was successfully downloaded from the owner's exact NSF URL and read; the lab also provides a separately downloaded dpass.pdf version, but the public copy preserves the supplied NSF file. Original PDF notices and full author credits remain intact. No access control was bypassed.

The retrieved lab listing did not contain the Allerton paper. The owner then supplied https://arxiv.org/pdf/2412.05249 and explicitly requested retaining the original IDEALS link as the published record. The arXiv PDF was downloaded, its complete seven-page text read through the PDF reader, and an unchanged local copy added as assets/papers/ghost-channel-arxiv.pdf. It is the 2024 preprint titled An Information Theoretic Analysis of Ghost Modulation, with the same four authors. The 2025 Allerton title/venue remain grounded in the official indexed IDEALS record. The UI clearly labels the local file as an arXiv preprint rather than a byte-identical published paper, and retains the exact IDEALS record link. Its animation now illustrates the preprint's per-symbol heuristic: one event in a bit slot yields that bit; guard-only, missing or multiple events yield erasure. The deeper explanation covers channel asymmetry, reordering, acquisition/synchronization and coding while distinguishing a simplified drawing from those algorithms and BER simulations. The source-copy blocker is resolved without bypassing Illinois's 403 response.

WLSK's animation shows targeted reflector buffering, a wired trusted receiver, reply bursts and an invertible 11-chip Barker data pattern, with the unassociated sensor outside the network boundary. The omitted 31-chip sync word and illustrative timing are disclosed. The spectral coordination animation shows 63-chip OOK energy patterns, the eight-symbol request and compliant/ignored responses across WiFi/LoRa/LTE; Hadamard processing remains downstream context. Its internally consistent example is 10 minutes, center 2450 MHz, bandwidth 20 MHz. The paper's digital Hadamard demonstration and unusable packaged notch-filter result are distinguished from intended analog capability.

Three new collection entries/pages bring Publications to six and total homepage works to thirteen. The reusable publication layout now supports page-specific captions, owner-confirmed contribution focus, optional original-figure sections and repository paper destinations. Existing localization pages and resources retain their behavior. Local implementation/checkpoint commits remain authorized; push and publication remain unauthorized.


### Chronological work order and hover previews — November 3, 2026

The owner confirmed 3D Hand Reconstruction occurred in 2024 and requested chronological ordering within each section plus animated previews on mouse hover. Projects/Publications now render newest year first, retaining numeric order as the stable tie-breaker within a year. No month/day is invented. All populated work sections use this rule; remaining empty sections keep their visible placeholders. The owner-supplied hand date supersedes earlier instructions to leave its year unspecified because the report itself is undated.

Preview links opt into the existing shared hover runtime. A real mouse hover or visible keyboard focus restarts preview playback; leaving or blurring restores the meaningful still. Touch does not enable hover playback, and reduced-motion initialization suppresses it. Hand, catcher and odometry figures now permit time-dependent compact rendering during playback rather than forcing their preview still pose. The clean channel example has a moving time cursor while playing, without changing its illustrated event decisions. Full disclosure behavior and existing controls remain available.


### Immediate hover motion refinement — November 3, 2026

Owner feedback identified catcher/odometry previews that appeared static and a slow WiLiE start. Compact figures now support optional previewStartAt and previewSpeed settings. Catcher starts at 1.5 seconds and plays at 3x; odometry starts at 2 seconds and plays at 3x; WiLiE starts at 1.5 seconds and plays at 2.5x. Full figures retain their original timing. Hover leave restores the original still; reduced-motion and touch behavior remain unchanged. This supersedes the earlier statement that every hover begins at time zero.
