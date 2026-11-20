# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Adam Roffler, a DevOps Engineer and Cloud Architect. The site is static HTML on one stylesheet, with zero JavaScript and a light/dark theme that follows the OS.

## Architecture

- Static HTML pages: `index.html` (portfolio), `resume.html`, `ageforge.html`, `abend.html`, `aws-cloud.html`.
- One stylesheet, `styles.css`. It is the design, and the class vocabulary lives in its header and selectors. Use only classes that exist there. Do not add inline `style` attributes.
- No JavaScript anywhere. No scripts, no CDNs, no web fonts.
- Colors are tokens on `:root`, redefined under `@media (prefers-color-scheme: dark)` and for print. There is no theme toggle.
- Mobile is the same responsive page (breakpoints at 768px and 480px). There is no separate mobile site.
- `_redirects` (Netlify) sends the retired `/m/` paths to the root pages.

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
- Profile image is `profile-image.webp`. Project images are `abend-*.webp`.

## Important Notes

- Contact email: `espresso20@pm.me`
- LinkedIn URL: `https://www.linkedin.com/in/adam-roffler/`
- GitHub URL: `https://github.com/espresso20`
- Resume page: `resume.html` with PDF download (`adam-roffler-resume.pdf`)
