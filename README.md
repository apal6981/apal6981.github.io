# Ashton Palacios portfolio

A custom Jekyll 4.4.1 portfolio, implemented locally from IMPLEMENTATION_PLAN.md. Verified substantial additions are committed locally with the user's authorization; push and publication require separate authorization. Existing starter About/post files are preserved but excluded from output.

## Preview and build

The tested local environment is Ruby 4.0.9 / Bundler 4.0.23 on Windows. Install Ruby with development tools, then run:

```powershell
bundle install
bundle exec jekyll serve
```

Open http://localhost:4000. Restart the server after configuration changes. If watching is noisy in OneDrive, use `bundle exec jekyll serve --no-watch` and build explicitly after edits.

```powershell
$env:JEKYLL_ENV='production'
bundle exec jekyll build --strict_front_matter
python scripts/check-output.py _site
bundle exec jekyll build --strict_front_matter --baseurl /portfolio-check --destination _site-subpath
python scripts/check-output.py _site-subpath /portfolio-check
```

No Node build or frontend framework is required. Generated `_site`, `_site-subpath`, browser profiles and QA artifacts are ignored and excluded from publication.

## Edit content

- `_data/profile.yml`: introduction, biography, portrait path, resume path, social links (`title`, `url`) and contact URL (including `mailto:` if appropriate). Blank values show honest placeholders.
- `research`, `experience`, `education`, `awards`, `skills` are lists of records with `title`, optional `date`, and `description`. Populating them replaces placeholders without template changes. Preserve the section list and IDs to retain navigation/deep links.
- `_projects`, `_publications`: one Markdown document per work, ordered newest first by `year`, with numeric `order` breaking ties. Collections render into the homepage, with no standalone work pages.
- Work metadata preserves the reference field names: `authors`, `venue`, `year`, `link`, `link_label`, `links` (`text`, `url`, `note`), `figure` (fallback path), `fig`, `fig_aspect`, `fig_label`, `fig_caption`, `fig_illustrative`, `about` or `abstract`, and `first_author`. Added fields are `order` and `summary` (a short project-level description).
- Longer prose can go in the Markdown body. Keep author order and equal-contribution markers. Emphasize Ashton without dropping shared credit. Do not invent individual roles or personal credentials.
- Work deep links: `#work-bellhop`, `#work-wilie`, `#work-ghost-modulation`, `#work-sss`; disclosure links start with `#details-` and the same slug.

When adding a work, copy a collection document, choose a unique filename/slug and `order`, add resources under `assets`, and supply an accurate fallback and accessible caption. Figure scripts are loaded once from the unique `fig` values used by the collections. New interactive figures must register with `Fig.register` and have a matching `assets/js/figures/<fig>.js`. Static content and resources must remain useful without Canvas or JavaScript.

## Design and graphics

PRODUCT.md and DESIGN.md record confirmed context and the ivory/charcoal/copper system. CSS tokens, responsive composition and theme colors live in `assets/css/site.css`; theme preference is applied before paint by `theme.js`. System mode follows the OS; explicit Light/Dark preferences persist when storage is available.

The four figure definitions and shared Canvas kit were adapted from the local `christopolise.github.io` reference with the user's confirmed permission. No public license is asserted. Original code comments and complete research authorship remain. Seven PDFs and eight fallback illustrations accompany the selected works. No reference portrait, CV, contact details, domain or analytics configuration was imported. Illustrative graphics retain explicit captions; they are not represented as measured results.

Local runtime fixes: system font mapping; resilient static fallback; lazy full-figure initialization within open disclosures; safe control rebuilding on restart. The SSS wave rasterizer now skips equal-height interpolation to prevent an infinite loop.

## Checks

See VALIDATION.md for evidence and limits. `scripts/check-output.py` uses only Python's standard library. Optional browser scripts use Node 22+ native WebSocket/CDP against a dedicated local Chromium debug instance on port 9222 and the preview on port 4000. They write ignored `artifacts/` screenshots and JSON, and are development checks only. Do not attach them to a personal browser session.

## Future release

`.github/workflows/pages.yml` builds pull requests. Only explicit `workflow_dispatch` builds and deploys Pages; pushes do not publish. Repository URL, release authorization and Pages settings are still deferred. Do not run the release workflow until authorized.

The lockfile was resolved on Windows. Linux resolution could not run locally because RubyGems access is blocked. The workflow adds the Linux platform before installing locked dependencies; its first execution must verify Ruby availability, dependency resolution and Pages artifact compatibility. Once network access is available, run `bundle lock --add-platform x86_64-linux`, review and retain the resulting platform variants. Never claim Linux CI passed until it has run.

For a root/custom-domain site set `url` to the actual origin and `baseurl` to an empty string; for a repository site set `baseurl` to `/repository-name`. Internal paths use `relative_url`. The manual release obtains origin/base path from Pages metadata. Canonical metadata is omitted locally while `url` is empty. No CNAME is supplied.

Workflow structure checked against [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages); custom Bundler/Jekyll build is retained rather than the constrained branch-build stack.

## Additional school projects

Projects now also includes 3D Hand Reconstruction, Self-Driving RC Racer, Monocular Visual Odometry and Robot Baseball Catcher. Their original Canvas definitions share small drawing primitives in `assets/js/figures/engineering.js`, loaded only when a work uses `figure_family: engineering`. The shared kit supports optional `config.mobileAspect` for taller multipart figures on phones. Existing figures retain their original sizing.

The hand report is copied byte-for-byte to `assets/3D_Reconstruction_of_Infant_Keepsakes_Report.pdf` with user permission and linked locally. Its author order is Derek Benham, Ashton Palacios. No year is inferred. The reconstruction illustration separates COLMAP pose/bounds estimation from Neuralangelo surface optimization; its adult hand is designed geometry, not a recovered model. The three other projects preserve the exact YouTube destinations supplied by the owner. Video playback remains unverified here. Additional unnamed teammates on the racer/catcher are explicitly acknowledged; `credit_note` can be updated when names arrive.

All new figures have exported, checked-in PNG fallback images under `assets/figures/`. `node scripts/browser-new-projects.cjs` checks project counts, image-click opening/reopening, six responsive/theme combinations, stage/cone/drift/pitch controls, duplicate controls and closed-figure pause. The usual dedicated local preview and Chromium CDP instance are required. Add `--write-fallbacks` only when intentionally refreshing the canonical light-theme stills after figure changes; review the generated PNGs before committing.

## Hand mesh revision

The hand figure uses a single connected open-hand mesh with tapered, articulated fingers, a thumb, palm and wrist. `scripts/generate-hand-mesh.py` creates `assets/js/figures/hand-mesh.js` using only Python's standard library, and validates watertight edges and a single connected component. This is original illustrative geometry; it is not a scan or the report's recovered model.

The Canvas renderer interpolates vertex lighting through a reusable depth buffer, avoiding visible polygon seams. Mesh data is loaded once, only when the hand figure is present. `node scripts/browser-hand.cjs` checks the four stages at 375/768/1440 in both themes, repeated controls, reduced motion and the single local Report link. Add `--write-fallback` to refresh only the hand's PNG after an intentional mesh change. The external Original report resource was removed at the owner's request; the local PDF is retained.


## Catcher background and two-model figure

`projects/baseball-catcher.md` renders at `/projects/baseball-catcher/`. Its original source photographs/plots are configured in `_data/baseball_catcher.yml`; edit the draft and image captions there. The shared background layout reads `gallery_key`, `demo_label` and `preview_caption`, retaining the Racer's defaults when absent. Preserve Derek's experiment credits and the distinction between original images and illustrative Canvas output.

`assets/js/figures/baseball-catcher.js` shows a head-on X model for left/right motion and a side Y model for elevation during approach, feeding the combined XY catch target. The schematic curves/timing are not recorded project model data. `Switch pitch` changes both target coordinates. Refresh the fallback through `node scripts/browser-catcher.cjs --write-fallback` only when intentional, then rebuild Jekyll.

The browser check requires an already installed Playwright module (`PLAYWRIGHT_MODULE` may point to its absolute directory), Chromium with its debugging port at `127.0.0.1:9222`, and Jekyll at `127.0.0.1:4000`. It writes screenshots/results to ignored `artifacts/`. In this WSL session, Linux gems and Chromium are under ignored `vendor/wsl-*`; use Linux Ruby and Bundler rather than the Windows `bundle` found on PATH.


Catcher perspective correction: both stereo frames face the incoming ball. The main catcher view shows lateral and vertical motion together; small X/time and elevation/time plots are derived from the same stereo observations. There is no side camera in the animation. This supersedes the earlier head-on/side description.


## Acoustic and LoRa publications

Edit `_publications/acoustic-localization.md` and `_publications/lora-localization.md` for homepage metadata, complete author credits, summaries and captions. Deeper explanations are in `publications/`, rendered by `_layouts/publication-background.html` at `/publications/acoustic-localization/` and `/publications/lora-localization/`. The layout includes the local paper links and an Individual contributions placeholder; replace that placeholder with owner-supplied text when available. Original overview graphics are in `assets/images/localization/`; byte-identical source PDFs are in `assets/papers/`.

`assets/js/figures/localization.js` implements the shared educational particle filter. Its irregular signal fields and moving/stopped classifier are synthetic substitutes to explain the papers' GP/GMM pipeline, not trained research models. The two short figure definitions select acoustic or urban behavior. The acoustic update uses one beacon at a time; LoRa can combine four observations and exposes a robot stop/resume control. `Step filter` pauses playback and advances motion, measurement or resampling. The synthetic reference marker is an explanatory reference, not a position measurement supplied to the filter.

With the existing local Jekyll/CDP setup and installed Playwright module, run `node scripts/browser-publications.cjs`; `PLAYWRIGHT_MODULE` can identify the installed module directory. The optional `--write-fallback` refreshes the two intentional PNG assets, then requires a Jekyll rebuild. Results and viewport/theme captures go under ignored `artifacts/`. No frontend build pipeline or production Node dependency is introduced.


Publication animation pacing: `localization.js` advances one phase every 0.3 seconds (0.9 seconds per full cycle). `stillAt: 3.75` preserves the earlier preview state at the faster cadence. The signal-field background is cached by beacon, dimensions and theme; moving particles and controls continue to redraw normally.


LoRa stopped behavior now uses very small process jitter when the signal-history classifier selects stopped, so continued measurement updates can concentrate the particle cloud. Resuming motion restores greater propagation uncertainty. The illustration remains a toy model.

The LEO figure separates the main antenna lobe (to a user terminal) from fixed-angle sidelobe leakage passing over the observatory. Its local fallback is `assets/figures/ghost-modulation.png`. `scripts/browser-ghost.cjs` checks this geometry and the normal/replay interaction; the intentional `--write-fallback` option exports the PNG. The two localization entries and research pages retain local PDFs and include the owner's supplied IEEE Xplore links.


## WLSK, coordination subprotocol and Ghost Modulation channel

New publication entries and matching local research pages use slugs `wireless-latency`, `spectral-coordination` and `ghost-channel`. Their figure scripts live in `assets/js/figures/`; each uses the existing shared Canvas kit and engineering primitives. Toggle the WLSK bit, honor/ignore the coordination request, or compare clean/delayed/dropped events in the conceptual channel illustration. All timings and signal samples are schematic, with no actual network traffic generated.

Unchanged local source PDFs for WLSK, spectral coordination and the related Stealthy Signals workshop paper are in `assets/papers/`. The workshop PDF/ACM link and its distinct full author credits are attached to the existing LEO entry. The Allerton channel paper retains the owner's exact IDEALS publication-record link and hosts the supplied arXiv preprint at `assets/papers/ghost-channel-arxiv.pdf`. The file's earlier 2024 title, An Information Theoretic Analysis of Ghost Modulation, is explicit in the UI. The animation illustrates its per-symbol heuristic, including erasure when multiple events arrive; it does not reproduce acquisition or coded BER simulations.

`_layouts/publication-background.html` supports `preview_caption`, `contribution_focus`, optional `source_figure` metadata, and `paper_url` when no local `link` is supplied. The spectral coordination page records the owner's confirmed subprotocol focus; other individual details remain placeholders.

Run `scripts/browser-new-publications.cjs` with the existing Playwright/CDP setup to check six theme/viewport combinations, control behavior, resource links, local PDFs, contribution headings, return navigation, reduced motion and no-JS fallbacks. `--write-fallback` intentionally regenerates the three PNG stills. The older publication/project suite counts now expect six publications and thirteen total works.


## Chronology and preview playback

Homepage work collections sort by year descending; numeric order is only the tie-breaker within a year. Hand reconstruction is dated 2024 by owner confirmation. Keep year metadata factual; no exact dates are inferred from an undated report.

Preview links use data-hover-play. Mouse hover and visible keyboard focus start playback from the beginning, and mouse leave/focus loss restore stillAt. Initial reduced-motion preferences suppress previews; touch taps open the full disclosure. Do not hardcode a compact figure to a still pose while it is playing. The channel diagram includes a time cursor so the clean case visibly previews without altering its bit decisions.

`scripts/browser-order-hover.cjs` checks ordering and all thirteen previews with real browser mouse movement, advancing timestamps and changed canvas pixels, then checks return-to-still, keyboard focus, touch and reduced motion. Captures/results go under ignored artifacts.


Hover previews use per-figure pacing where needed: catcher and odometry play at 3x, and WiLiE at 2.5x, beginning in an active phase. Expanded figures retain their full explanatory timing.
