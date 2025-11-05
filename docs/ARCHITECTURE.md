# Repository architecture & contribution conventions

This document explains the folder layout and where to place different contribution types.

Top-level folders:
- `.github/` — issue/PR templates, workflows, codeowners.
- `assets/` — logos, header images, social preview images.
- `ai-ml/`, `web-development/`, `cybersecurity-ctf/`, `dev-tools-automation/`, `iot-embedded/` — category READMEs and smaller resources.
- `starters/` — minimal starter project templates and blueprints.
- `docs/` — repo-level docs and architecture notes.

Content types:
- Resource listings: place as `README.md` inside a category folder.
- Starter projects: place in `starters/<project-name>/` with a `README.md`.
- Notebooks or large files: prefer external hosting (Git LFS or links) — keep repo size small.

Naming & style:
- Filenames: kebab-case (no spaces).
- Markdown: short summaries, a 1-line annotation for each link, and usage with copyable commands.
- PRs: small, actionable, and focused.

If you add large datasets or media, open an issue first so maintainers can advise on hosting and licensing.