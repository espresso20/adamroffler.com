# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Adam Roffler, a DevOps Engineer and Cloud Architect. The site is built with vanilla HTML, CSS, and JavaScript using a modern glassmorphic design with dark/light theme support.

## Architecture

### Theme System
The site uses CSS custom properties (variables) for theming, defined in `styles.css`:
- Dark theme is the default
- Light theme variables are defined under `[data-theme="light"]`
- Theme preference is stored in localStorage
- Theme toggle logic is in `script.js:3-28`

### Page Structure
- `index.html` - Main portfolio page with sections: Hero, About, Skills, Experience, Contact
- `aws-cloud.html` - Secondary page showcasing cloud projects
- Both pages share the same `styles.css` and `script.js`

### JavaScript Features
The site uses vanilla JavaScript with no frameworks. Key features implemented in `script.js`:

1. **Theme Toggle** (lines 4-28): Persists to localStorage
2. **Smooth Scrolling** (lines 33-70): Active nav state updates on scroll
3. **Typing Animation** (lines 75-128): Hero subtitle cycles through job titles
4. **Animated Counter** (lines 133-150): Counts up years of experience stat
5. **Intersection Observer** (lines 155-180): Triggers AOS (Animate On Scroll) animations
6. **Parallax Effect** (lines 212-219): Hero background moves with scroll
7. **Easter Egg** (lines 275-303): Konami code triggers rainbow animation

### Styling Architecture
`styles.css` is organized into sections:
- CSS Variables for theming (lines 4-46)
- Component-specific styles (navigation, hero, cards, timeline, etc.)
- Glass card effect (lines 323-338) used throughout for consistent UI
- Responsive breakpoints at 768px and 480px

## Development Workflow

### Local Development
Simply open `index.html` in a browser. No build process required.

### Deployment
The website automatically deploys to production via Netlify when changes are pushed to GitHub. No manual deployment steps needed.

### Testing Changes
- Test both dark and light themes using the theme toggle button
- Test responsive design at mobile breakpoints (768px, 480px)
- Verify smooth scrolling between sections
- Check typing animation cycles through all job titles
- Test Konami code easter egg: ↑↑↓↓←→←→BA

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
- All colors use CSS custom properties for theme compatibility
- Glass card effect is the primary UI pattern (backdrop-filter + border + shadow)
- Gradient accent colors: `--accent-primary` (#64ffda) and `--accent-secondary` (#6c63ff)
- All animations are defined with `@keyframes` at the bottom of styles.css

### JavaScript
- No external dependencies (uses vanilla JS)
- Event listeners use passive: true for scroll performance
- Intersection Observer preferred over scroll listeners for animations
- All major features are section-commented with `// ====` separators

### HTML
- Font Awesome 6.4.0 CDN for icons
- Sections use id attributes for navigation anchors
- AOS animations triggered via `data-aos` attributes and Intersection Observer
- Profile image and cloud.jpeg are the only image assets


## Mobile Site

`m/index.html` is a separate mobile-first page. It is **generated**, not
hand-written:

```bash
python3 build/gen_mobile.py     # re-read index.html, rewrite m/index.html
```

`build/gen_mobile.py` scrapes the experience timeline, tech stack,
certifications, about copy and project cards out of `index.html` and re-lays
them out for a phone. It also generates `m/ageforge.html` and `m/abend.html`
from the showcase pages of the same name, pulling their hero copy, stat
numbers, section prose, core-loop diagram and screenshots. Editing `m/index.html` directly means the next run
overwrites it -- change `index.html` and regenerate instead. That is the whole
reason it is generated: a hand-maintained second page drifts the first time a
job is added to one and not the other.

**Re-run it after any content change to index.html, ageforge.html or abend.html.**

The build fails if any local link on a generated page does not resolve. That
check exists because the first version shipped `ageforge.html` instead of
`../ageforge.html`, which 404'd from `/m/`.

### Routing
An inline script in `index.html` sends `(max-width: 640px)` *and*
`(pointer: coarse)` visitors to `m/index.html`. That is feature detection, not
User-Agent sniffing, which misreads tablets, foldables and desktop-mode-on-phone.

- "View desktop site" on mobile links to `index.html?desktop=1`, which sets
  `localStorage.preferDesktop` and suppresses the redirect from then on.
- `m/index.html?mobile=1` clears that flag.
- `index.html` carries `rel="alternate"` and `m/index.html` carries
  `rel="canonical"` back to the root, so search engines treat them as one page.

### Design notes
The mobile page shares no CSS with the desktop site -- its styles are inline and
self-contained. It deliberately avoids `backdrop-filter` (renders as a solid
pale box on several mobile browsers), the particle canvas, the typing animation
and parallax. Navigation is a bottom tab bar rather than a top hamburger,
because that is where thumbs are.

## Important Notes

- Contact email: `espresso20@pm.me`
- LinkedIn URL: `https://www.linkedin.com/in/adam-roffler/`
- GitHub URL: `https://github.com/espresso20`
- Resume page: `resume.html` with PDF download (`adam-roffler-resume.pdf`)
