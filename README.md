# Ashton Palacios portfolio

A custom Jekyll 4.4.1 portfolio, implemented locally from IMPLEMENTATION_PLAN.md. No commit, push or publication has been performed. Existing starter About/post files are preserved but excluded from output.

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
- `_projects`, `_publications`: one Markdown document per work, ordered by numeric `order`. Collections render into the homepage, with no standalone work pages.
- Work metadata preserves the reference field names: `authors`, `venue`, `year`, `link`, `link_label`, `links` (`text`, `url`, `note`), `figure` (fallback path), `fig`, `fig_aspect`, `fig_label`, `fig_caption`, `fig_illustrative`, `about` or `abstract`, and `first_author`. Added fields are `order` and `summary` (a short project-level description).
- Longer prose can go in the Markdown body. Keep author order and equal-contribution markers. Emphasize Ashton without dropping shared credit. Do not invent individual roles or personal credentials.
- Work deep links: `#work-bellhop`, `#work-wilie`, `#work-ghost-modulation`, `#work-sss`; disclosure links start with `#details-` and the same slug.

When adding a work, copy a collection document, choose a unique filename/slug and `order`, add resources under `assets`, and supply an accurate fallback and accessible caption. Figure scripts are loaded once from the unique `fig` values used by the collections. New interactive figures must register with `Fig.register` and have a matching `assets/js/figures/<fig>.js`. Static content and resources must remain useful without Canvas or JavaScript.

## Design and graphics

PRODUCT.md and DESIGN.md record confirmed context and the ivory/charcoal/copper system. CSS tokens, responsive composition and theme colors live in `assets/css/site.css`; theme preference is applied before paint by `theme.js`. System mode follows the OS; explicit Light/Dark preferences persist when storage is available.

The four figure definitions and shared Canvas kit were adapted from the local `christopolise.github.io` reference with the user's confirmed permission. No public license is asserted. Original code comments and complete research authorship remain. Six PDFs and the four fallback illustrations accompany the selected works. No reference portrait, CV, contact details, domain or analytics configuration was imported. Illustrative graphics retain explicit captions; they are not represented as measured results.

Local runtime fixes: system font mapping; resilient static fallback; lazy full-figure initialization within open disclosures; safe control rebuilding on restart. The SSS wave rasterizer now skips equal-height interpolation to prevent an infinite loop.

## Checks

See VALIDATION.md for evidence and limits. `scripts/check-output.py` uses only Python's standard library. Optional browser scripts use Node 22+ native WebSocket/CDP against a dedicated local Chromium debug instance on port 9222 and the preview on port 4000. They write ignored `artifacts/` screenshots and JSON, and are development checks only. Do not attach them to a personal browser session.

## Future release

`.github/workflows/pages.yml` builds pull requests. Only explicit `workflow_dispatch` builds and deploys Pages; pushes do not publish. Repository URL, release authorization and Pages settings are still deferred. Do not run the release workflow until authorized.

The lockfile was resolved on Windows. Linux resolution could not run locally because RubyGems access is blocked. The workflow adds the Linux platform before installing locked dependencies; its first execution must verify Ruby availability, dependency resolution and Pages artifact compatibility. Once network access is available, run `bundle lock --add-platform x86_64-linux`, review and retain the resulting platform variants. Never claim Linux CI passed until it has run.

For a root/custom-domain site set `url` to the actual origin and `baseurl` to an empty string; for a repository site set `baseurl` to `/repository-name`. Internal paths use `relative_url`. The manual release obtains origin/base path from Pages metadata. Canonical metadata is omitted locally while `url` is empty. No CNAME is supplied.

Workflow structure checked against [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages); custom Bundler/Jekyll build is retained rather than the constrained branch-build stack.
