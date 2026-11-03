# Local validation - November 1, 2026

## Passed

- Windows Ruby 4.0.9 / Bundler 4.0.23: local dependency installation and Jekyll 4.4.1 strict-front-matter production builds at root and `/portfolio-check`.
- Standard-library output checker: all current planned section anchors, unique IDs/scripts, internal resource paths, six local PDFs, styled 404 and publication exclusions. Starter About/post content remains on disk but is absent from output.
- Headless Chrome screenshots and layout measurements at 375, 768, 1440 CSS pixels in Light and Dark, plus expanded figures at all six combinations. No horizontal page overflow. Selected desktop/mobile/tablet captures visually inspected.
- Four still previews at initial load; full canvases initialize only when a disclosure opens. Three repeated open/close/restart cycles leave three buttons per full figure, with no duplicates. Normal browser checks recorded no JavaScript errors.
- Acoustic profile, antenna, replay-attack and ring/wave controls change state. A reused SSS wave interpolation bug hung the renderer when adjacent heights matched; fixed and all four controls retested successfully.
- Native disclosure activated with synthesized Enter; visible keyboard focus verified. SSS deep link opens its disclosure. Closed figures pause.
- System Dark follows emulated OS preference; explicit Light survives reload. Reduced-motion mode produces nonplaying, meaningful still frames.
- Injected Canvas failure preserves fallback images across all figures. Injected unavailable localStorage leaves the theme control usable. JavaScript-disabled reload preserves static image fallbacks. Expected Canvas errors during fault injection are not normal-load errors.
- Body/secondary/tertiary/accent and placeholder text token contrast calculated in both themes. Minimum tested ratio 5.03:1; primary text approximately 14.2:1. This does not certify every animated pixel or screen-reader behavior.
- JavaScript syntax checks; complete shared authorship retained, Ashton emphasized, equal-contribution note preserved, synthetic data labeled.

## Impeccable review

Context and new-work/craft-floor guidance applied within the already finalized user brief. Concept service unavailable; no external challenger boards were returned. Static detector flags for section padding were false positives from logical `padding-block`; rendered sections have ample spacing. Rendered detector found the deliberately approved ivory background and two advisory line-wrap findings. The ivory commitment is retained, and `text-wrap: pretty` was added. A centered portrait placeholder has explicit padding. Rendered screenshots informed the review; detector output is not treated as proof of visual quality.

## Limits

- Browser evidence is headless Chrome on this Windows host, using emulated viewport/media settings and synthesized keyboard input. No physical phone, touch gesture suite, Safari/Firefox, screen reader, full WCAG audit or performance certification was performed. Canvas labels have text alternatives and detailed captions; small previews are navigation context rather than the full reading surface.
- The kit retains viewport observation and pauses tick advancement offscreen. Closed-state pause is explicitly exercised; exhaustive offscreen timing and dynamic reduced-motion changes during a live session are not certified.
- External code/docs/video/publisher destinations were preserved from source, not individually verified. Local PDFs and images were checked. No claims about external link availability are made.
- Network access to RubyGems is denied, preventing generation/testing of Linux platform variants. CI resolves that platform before install but has not run. First CI execution remains required before release.
- No Git remote, production origin, Pages setup, deployment or external hosting behavior was tested. No commits, pushes or publication performed.

Ignored `artifacts/` contains viewport/expanded-figure screenshots, `browser-results.json`, `extended-results.json`, and detector reports. Scripts are retained under `scripts/` for repeatable local checks; no heavy test framework or Node build dependency was added.

## Header and section revision

ATP wordmark, sticky header, current-section indication, and header-aware anchor offsets checked in headless Chrome at 375/768/1440 in both themes. Header top stays at zero after scrolling; Projects heading remains below it, with no horizontal overflow. Projects contains three works including SSS; Posters and Teaching and their navigation links are removed. Root/subpath strict builds, local resources and JavaScript syntax pass after the revision.

## Four school-project addition

- Strict production builds and output checks pass at root and `/portfolio-check`; local image/report resources resolve and all three exact owner-supplied video URLs remain present. There are now seven Projects and one Publication. All seven PDFs are checked explicitly rather than requiring an arbitrary total that would reject future additional reports.
- The hand PDF matches the staged source byte-for-byte. Seven pages were read before implementation; camera poses/region selection are distinct from neural surface generation, and adult-hand results are distinguished from unprocessed newborn footage. No year is invented.
- New figures were rendered in headless Chrome at 375, 768, 1440 CSS pixels, Light and Dark (24 expanded-figure captures). Mobile layouts were enlarged after visual inspection to avoid cramped subpanels; labels and controls remain visible with no page overflow.
- New project image clicks open/reopen the correct disclosure, including when the hash is unchanged. Hand stage buttons, racer cone toggle, odometry drift slider and catcher pitch control change their states. Three close/open/restart cycles do not duplicate controls. Closed figures pause; the normal run reports zero JavaScript errors.
- Existing figure controls and all six original figure layout combinations were rechecked after the opt-in runtime sizing extension. Keyboard disclosure/focus, SSS deep linking, persisted/system themes, reduced-motion stills, injected Canvas failure, blocked storage and no-JS image visibility pass across the expanded page.
- Four PNG stills were exported from the actual Canvas drawings and committed as intentional fallback assets, not QA captures. Development screenshot/JSON results remain ignored under `artifacts/`.
- Limits remain: headless Chrome rather than physical-device or cross-engine testing; YouTube playback unverified; Linux CI/Pages deployment not run. Racer/catcher third teammate names remain pending and are acknowledged visibly. No push or deployment authorized.

Rendered Impeccable review after the addition flagged the approved ivory palette and two existing long-line warnings in the SSS description/caption. These are recorded as presentation polish, not failures of project content or figure interaction.

## Hand mesh revision

The first-draft disconnected-looking ellipsoids were replaced with one continuous open-hand surface (5,690 vertices / 11,376 triangles). Offline topology checks confirm every mesh edge is shared by two faces and all vertices form one connected component. The generator preserves these checks for future edits. Smooth interpolated vertex lighting and a depth buffer replace the faceted painter-style rendering; the print stage clips the surface at the layer height.

All four stages pass at 375/768/1440 in both themes (24 captures), with no page overflow or JavaScript errors. Selected mobile/desktop captures were visually reviewed. Reopening/restarting does not duplicate controls, and reduced motion shows the still at 13 seconds. Average measured redraw was approximately 5 ms on this host in the dedicated browser check; this is a local timing sample, not a device-wide performance guarantee. A refreshed hand PNG supplies the static fallback. Root/subpath strict builds and URL checks pass. The resource list contains only the local PDF link; the external Original report link is absent. Other projects and their assets were not changed.


## Catcher models and background page — WSL verification

- Strict Jekyll 4.4.1 production builds and `scripts/check-output.py` pass at root and `/portfolio-check`, covering four HTML pages and their local resources/cross-page anchors.
- Head-on X and side Y projections use one synchronized pitch and feed one XY intercept. Three pitch variants reach distinct targets; catcher alignment at arrival is checked in both dimensions. Original illustrative curves are not represented as fitted project data.
- `scripts/browser-catcher.cjs` passes 30 checks in Playwright/Chromium: 375/768/1440 Light/Dark figure/page overflow, model synchronization and arrival alignment, all four original images, repeated controls, local-page return link, reduced-motion stills, no-JS fallback, Racer gallery/label regression and no JavaScript errors. Screenshots are under ignored `artifacts/catcher-*.png`; results are in `artifacts/catcher-review-results.json`. Mobile panels stack vertically, desktop panels sit side by side. Selected captures were visually inspected.
- The static catcher PNG was refreshed from the revised Canvas. Four source image files were decoded and their dimensions verified. The source page and same-host media were retrieved with curl; YouTube playback was not tested.
- The browser command ran with the same explicit command-scoped sandbox exception approved for Racer. No dependency installation, sudo, system changes or publication. Coverage remains headless Chromium, not physical hardware, Safari/Firefox or screen-reader certification.
- During test development an ambiguous no-JS image selector was narrowed to the preview image; scrolling the tall mobile figure and allowing resize to settle corrected a blank QA capture. These were test-harness corrections. Final checks passed.


## Catcher head-on stereo correction

The side-perspective animation was rejected and replaced with two head-on camera frames, a head-on catcher showing both lateral and vertical ball motion, and derived X/time and elevation/time plots. Both cameras see the incoming ball; growing disparity and ball size indicate approach. The plots are not camera feeds. The source Gaussian-process plot in the gallery remains separately credited as an experimental artifact. The static fallback, caption and background explanation were updated to match.

Corrected figure verification: 33 Playwright checks passed, including decreasing approach depth/increasing stereo disparity, simultaneous lateral and vertical movement, and XY arrival alignment for all three pitches. Mobile/desktop screenshots were visually inspected. Root/subpath strict builds and local-resource/anchor checks pass after refreshing the PNG fallback.


## Acoustic and LoRa publication addition — November 2, 2026

- Strict Jekyll 4.4.1 production builds and resource/anchor checks pass at root and `/portfolio-check`, covering six generated HTML pages. Three publications and seven projects remain visible. Shared publication layout links the correct local PDF and homepage disclosure.
- `scripts/browser-publications.cjs` checks both full figures/pages at 375/768/1440 in Light/Dark, filter phase stepping, normalized finite particles, measurement reweighting and weighted resampling from existing hypotheses. It checks acoustic beacon sequencing, robot stop/resume, contribution placeholders, local PDF responses, repeated controls, deep-link return, reduced motion, no-JS fallbacks and no normal-load JavaScript errors.
- Existing extended accessibility/fallback suite passes 38 checks, including keyboard disclosure/focus, theme persistence, reduced motion, Canvas failure, blocked storage and no-JS images. The school-project suite passes 46 checks with its total-work assertion updated to ten (seven projects and three publications). These are headless Chromium checks, not cross-engine or physical-device certification.
- Six figure captures and six complete research-page captures per publication were generated. Selected mobile/tablet/desktop and both-theme captures were visually inspected. The Canvas stills were exported as intentional fallback assets. Signal-map cells were adjusted to avoid an unintended overlapping grid appearance. Source figure dimensions are declared accurately.
- Local papers exactly match the retrieved PDFs: acoustic 869,801 bytes, SHA-256 f67091eb8badfe599a5b72b97b0f809e5891b3b4f996c1c4a50edc0d3c651e5b; LoRa 1,225,948 bytes, SHA-256 3a69bbc2f7e000663a2cd8f2b6b689c5ef8aa38c2a533711b9f6de550076fbba. Full authorship and source PDF notices are preserved. No claim is made that the educational animation reproduces trained-model outputs or paper accuracy.
- Browser commands use the owner's previously approved command-scoped sandbox exception with temporary local Jekyll fixtures. No new dependencies, sudo, system configuration changes, push or deployment. Experimental limitations and GPS reference use remain explicit in the research pages. Individual contributions await the owner's supplied details.
