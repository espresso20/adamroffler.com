# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Adam Roffler, a DevOps Engineer and Cloud Architect. The site is static HTML on one stylesheet, with zero JavaScript and a light/dark theme that follows the OS.

## Architecture

- Static HTML pages: `index.html` (portfolio), `resume.html`, `ageforge.html`, `aws-cloud.html`.
- One stylesheet, `styles.css`. It is the design, and the class vocabulary lives in its header and selectors. Use only classes that exist there. Do not add inline `style` attributes.
- No JavaScript anywhere. No scripts, no CDNs, no web fonts.
- Colors are tokens on `:root`, redefined under `@media (prefers-color-scheme: dark)` and for print. There is no theme toggle.
- Mobile is the same responsive page (breakpoints at 768px and 480px). There is no separate mobile site.
- `_redirects` (Netlify) sends the retired `/m/` and `/abend.html` paths to the root pages.
- `index.html` order: Hero, About, Skills, Experience, Certifications, What I Bring, Projects (Family Gradebook, Cloud & Infrastructure, Open source, then Games), Contact. Games stay below the professional work on purpose; there is no Games nav link.

## Development Workflow

### Local Development
Open the HTML files in a browser. No build process.

### Deployment
The website automatically deploys to production via Netlify when changes are pushed to GitHub. No manual deployment steps needed.

### Testing Changes
- Check the page in both light and dark OS appearance (`prefers-color-scheme`).
- Check layout at 768px and 480px widths, and that no page scrolls horizontally on a phone.
- Print the resume and confirm it prints cleanly.
- Run the link check: every local `href`/`src` must resolve, and every `#fragment` in the nav must match an `id` on `index.html`.
- Run `grep -n '<script' *.html`. It must print nothing.

### GitHub Actions
The repository has two Claude Code GitHub Actions:

1. **Claude Code Review** (`.github/workflows/claude-code-review.yml`)
   - Runs on pull requests
   - Uses the `code-review` plugin from claude-code-plugins

2. **Claude PR Assistant** (`.github/workflows/claude.yml`)
   - Triggers when `@claude` is mentioned in issues, PR comments, or PR reviews
   - Responds to custom prompts in comments

## Key Conventions

### CSS
- Every color is a custom property token. Do not hard-code colors in rules.
- Glass cards and gradients are gone. Surfaces are flat, with a 1px `--border`.
- Animations are limited to hover transitions and are disabled under `prefers-reduced-motion`.

### HTML
- Sections use `id` attributes for navigation anchors.
- Icons are inline SVG symbols in a hidden sprite at the top of the page, referenced with `<svg class="icon"><use href="#id"/></svg>`.
- Images get explicit `width` and `height` that match their real pixel size. Use `loading="lazy"` below the fold.
- Profile image is `profile-image.webp`.

## Resume PDF

`adam-roffler-resume.pdf` is **generated** from `resume.html`:

```bash
python3 build/gen_resume_pdf.py     # re-read resume.html, print the PDF with headless Chrome
```

It scrapes the header, summary, jobs and bullets, skills, certifications and
education (by the page's classes and section ids) and lays them out as a plain
print document. Edit `resume.html` and regenerate; never hand-export the PDF
(the hand-made one drifted: old address, old title, no current job). **Re-run it
after any content change to resume.html**, and update the scraper if you change
that page's structure. The PDF is public: no phone number, no references' contact
details. Needs Google Chrome or Chromium (or `CHROME=/path/to/chrome`).

## Important Notes

- Contact email: `espresso20@pm.me`
- LinkedIn URL: `https://www.linkedin.com/in/adam-roffler/`
- GitHub URL: `https://github.com/espresso20`
- Resume page: `resume.html` with PDF download (`adam-roffler-resume.pdf`)

## Models and Delegation

How Claude sessions divide work in this repository, local or remote.

- The session's own model designs, decides, writes the specs and reviews. It does not do bulk reading or implementation.
- Subagents run on a cheaper model: the `builder` agent (Haiku) for work that can be specified exactly, and the `investigator` agent (Sonnet) for work that needs judgment that cannot be written down in advance, such as debugging. Where those agent types do not exist, use `general-purpose` with `model: "haiku"` or `model: "sonnet"`. Never run a subagent on Opus or Fable unless asked.
- One subagent at a time unless asked for speed. Cut work so each part fits one context.
- Every spec says what is already done, what is left, what done looks like and what to report.
- Subagents commit in small steps and stop at a clean checkpoint when cut off.
