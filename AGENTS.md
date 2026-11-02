# Persistent project instructions

## Authority and current status

- Read `IMPLEMENTATION_PLAN.md` before working. It is the self-contained agreed implementation specification.
- Website implementation and local verification were explicitly authorized on November 1, 2026. The earlier documentation-only restriction is superseded. Do not commit, push or publish without authorization covering that action.
- The user explicitly wants ALL planned sections visible, even without content. Render clearly labeled placeholders and keep section navigation visible. Never revert to hiding empty sections.

## Product and architecture

- Owner: Ashton Palacios. Audience: engineering employers. Single scrolling portfolio with Projects and Publications and visible future personal/resume sections.
- Jekyll 4.4.1, GitHub Pages via GitHub Actions, reusable Liquid layouts/includes, Markdown collections and YAML data, plain CSS, minimal vanilla JavaScript. No SPA framework or Node build pipeline.
- Independent ivory/charcoal/copper design, code-first, responsive desktop/mobile, accessible System/Light/Dark mode with persisted explicit preferences.
- Use the installed `.agents/skills/impeccable/SKILL.md` for design work. Follow user constraints over conflicting skill workflow instructions; do not create implementation artifacts during documentation-only tasks.
- Do not invent personal credentials, roles, achievements or individual contributions. Preserve authorship and distinguish illustrative graphics from real measurements.

## Reference and reuse

- Reference clone: `C:\Users\pista\OneDrive\Documents\christopolise.github.io`; live https://kitras.dev/; upstream https://github.com/christopolise/christopolise.github.io . Local source is available even if network access fails.
- Reuse the actual four graphics and their shared Canvas kit, adapting presentation rather than copying the entire site. Exact source mappings are in the plan.
- User confirmed permission to adapt the friend's code/graphics without required attribution. Preserve applicable notices and full work credits. Do not assume a public license exists.
- Never copy the friend's personal details, analytics, domain settings, portrait, CV or unrelated projects.

## Working and verification conventions

- Inspect current repository state before changes; the initial starter files were untracked. Preserve unrelated edits. Do not clean/reset user work.
- Git may require a command-scoped `-c safe.directory=C:/Users/pista/OneDrive/Documents/palacios_ashton_website` for ownership checks. Do not alter global Git settings as a side effect.
- Use `relative_url`/`absolute_url` for internal paths; support root and repository-subpath hosting. Exclude instructions, design records, skills and local configuration from published output.
- Preview with `bundle exec jekyll serve`; validate with `bundle exec jekyll build --strict_front_matter`. Document dependencies and check CI platform compatibility.
- Inspect rendered layouts at 375px, 768px and 1440px in both themes. Check keyboard/focus, reduced motion, fallbacks, deep links and repeated figure interactions. Report limits honestly.
- Production deployment is manual initially. Do not silently deploy on source pushes or inherit the reference's CNAME/analytics configuration.
- Keep documentation synchronized with approved changes. Ask only about material missing decisions; do not re-ask settled preferences.
