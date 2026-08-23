#!/usr/bin/env python3
"""Generate m/index.html from index.html.

A hand-written second page drifts: you update a job on one and forget the
other. The mobile build reads the desktop page's content and re-lays it out,
so there is one place to edit and the two cannot disagree.

    python3 build/gen_mobile.py
"""
import os, re, json, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "index.html")
OUT_DIR = os.path.join(ROOT, "m")


def txt(h):
    h = re.sub(r"<[^>]+>", " ", h)
    h = html.unescape(h)
    return re.sub(r"\s+", " ", h).strip()


def scrape():
    s = open(SRC).read()

    jobs = []
    for m in re.finditer(r'<div class="timeline-content">(.*?)</div>\s*</div>', s, re.S):
        b = m.group(1)
        t = re.search(r"<h3>(.*?)</h3>", b, re.S)
        c = re.search(r'class="timeline-company">(.*?)</p>', b, re.S)
        d = re.search(r'class="timeline-description">(.*?)</p>', b, re.S)
        if not (t and c):
            continue
        company = txt(c.group(1))
        # "EverBright | Dec 2024 - Feb 2026" -> name and dates split apart
        parts = [p.strip() for p in company.split("|")]
        jobs.append({
            "title": txt(t.group(1)),
            "org": parts[0],
            "meta": " · ".join(parts[1:]),
            "desc": txt(d.group(1)) if d else "",
            "tags": re.findall(r'<span class="tag">(.*?)</span>', b)[:4],
        })

    # Certifications reuse the .skill-card class, so slice by section first --
    # keying off the class alone merges the two lists.
    def section(sid):
        m = re.search(r'<section id="%s".*?</section>' % sid, s, re.S)
        return m.group(0) if m else ""

    def cards(block):
        out = []
        for m in re.finditer(r'<div class="skill-card[^"]*"[^>]*>(.*?)(?=<div class="skill-card|</div>\s*</div>\s*</section>|\Z)',
                             block, re.S):
            b = m.group(1)
            h3 = re.search(r"<h3>(.*?)</h3>", b, re.S)
            para = re.search(r"<p>(.*?)</p>", b, re.S)
            if h3:
                out.append({"name": txt(h3.group(1)),
                            "detail": txt(para.group(1)) if para else ""})
        return out

    skills = cards(section("skills"))
    certs = cards(section("certifications"))

    about = [txt(p) for p in re.findall(
        r"<p>\s*((?:From managing|I started in the trenches|What sets me apart).*?)</p>", s, re.S)]

    projects = []
    for m in re.finditer(r'<a class="hero-project hp-(\w+)" href="([^"]+)"', s):
        key, href = m.group(1), m.group(2)
        # Prefer the mobile build of a project page when one exists -- sending a
        # phone from a mobile card to a desktop page is the whole bug this was
        # meant to fix. Otherwise hop up: this page is served from /m/, so a
        # bare ageforge.html would resolve to /m/ageforge.html.
        if key in PROJECTS:
            href = key + ".html"
        elif not re.match(r"^(https?:|mailto:|#|/|\.\./)", href):
            href = "../" + href
        projects.append({"key": key, "href": href})

    return {"jobs": jobs, "skills": skills, "certs": certs, "about": about, "projects": projects}


PROJECT_META = {
    "ageforge":   ("AgeForge",   "Idle empire builder in Go",        "#f0a500", "#ff6b35"),
    "abend":      ("ABEND",      "Cold-war terminal simulator",       "#00ff41", "#39ffb0"),
    "neonferatu": ("Neonferatu", "A theme for the whole toolchain",   "#ff3a8b", "#b767fc"),
}


def build():
    d = scrape()
    os.makedirs(OUT_DIR, exist_ok=True)

    projects = "".join(
        '<a class="pcard" style="--a:{a};--b:{b}" href="{href}"{ext}>'
        '<span class="pcard-name">{name}</span>'
        '<span class="pcard-desc">{desc}</span>'
        '<span class="pcard-go" aria-hidden="true">&rarr;</span></a>'.format(
            a=PROJECT_META[p["key"]][2], b=PROJECT_META[p["key"]][3],
            href=p["href"], name=PROJECT_META[p["key"]][0], desc=PROJECT_META[p["key"]][1],
            ext=' target="_blank" rel="noopener noreferrer"' if p["href"].startswith("http") else "")
        for p in d["projects"] if p["key"] in PROJECT_META)

    about = "".join(f"<p>{html.escape(p)}</p>" for p in d["about"])

    skills = "".join(
        f'<li><b>{html.escape(s["name"])}</b><span>{html.escape(s["detail"])}</span></li>'
        for s in d["skills"])

    jobs = "".join(
        '<li class="job{cur}"><div class="job-head"><h3>{t}</h3>'
        '<p class="job-org">{o}</p><p class="job-meta">{m}</p></div>'
        '{desc}{tags}</li>'.format(
            cur=" job-current" if i == 0 else "",
            t=html.escape(j["title"]), o=html.escape(j["org"]), m=html.escape(j["meta"]),
            desc=f'<p class="job-desc">{html.escape(j["desc"])}</p>' if j["desc"] else "",
            tags='<ul class="job-tags">' + "".join(f"<li>{html.escape(t)}</li>" for t in j["tags"]) + "</ul>"
                 if j["tags"] else "")
        for i, j in enumerate(d["jobs"]))

    certs = "".join(
        f'<li><b>{html.escape(c["name"])}</b><span>{html.escape(c["detail"])}</span></li>'
        for c in d["certs"])

    page = TEMPLATE
    for marker, value in (
        ("<!--PROJECTS-->", projects),
        ("<!--ABOUT-->", about),
        ("<!--SKILLS-->", skills),
        ("<!--JOBS-->", jobs),
        ("<!--CERTS-->", certs),
    ):
        page = page.replace(marker, value)

    path = os.path.join(OUT_DIR, "index.html")
    open(path, "w").write(page)

    # This page lives one directory down, so every root-relative href needs a
    # hop up. Shipping ../ageforge.html as ageforge.html once was enough.
    broken = []
    for href in sorted(set(re.findall(r'href="([^"]+)"', page))):
        if href.startswith(("http", "mailto:", "#")):
            continue
        target = os.path.normpath(os.path.join(OUT_DIR, href.split("?")[0]))
        if not os.path.exists(target):
            broken.append(href)
    if broken:
        raise SystemExit("  broken local links in m/index.html: " + ", ".join(broken))
    print(f"  m/index.html  {len(d['jobs'])} roles, {len(d['skills'])} skills, "
          f"{len(d['certs'])} certs, {len(d['projects'])} projects")
    return path


TEMPLATE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             "mobile_template.html")).read()


# ---------------------------------------------------------------- project pages

PROJECTS = {
    "ageforge": {
        "title": "AgeForge", "a": "#f0a500", "b": "#ff6b35",
        "hero_logo": "ageforge-logo", "hero_tag": "ageforge-tagline",
        "hero_sub": "ageforge-subtitle", "stat_num": "ageforge-stat-number",
        "stat_lab": "ageforge-stat-label",
    },
    "abend": {
        "title": "ABEND", "a": "#00ff41", "b": "#39ffb0",
        "hero_logo": "abend-logo", "hero_tag": "abend-tagline",
        "hero_sub": "abend-subtitle", "stat_num": "abend-stat-number",
        "stat_lab": "abend-stat-label",
    },
}


def scrape_project(slug, cfg):
    src = open(os.path.join(ROOT, slug + ".html")).read()

    def grab(cls):
        m = re.search(r'class="%s"[^>]*>(.*?)</' % cls, src, re.S)
        return txt(m.group(1)) if m else ""

    hero = {
        "logo": grab(cfg["hero_logo"]) or cfg["title"],
        "tagline": grab(cfg["hero_tag"]),
        "subtitle": grab(cfg["hero_sub"]),
    }

    # Hero call-to-action links, kept as-is: they are absolute.
    links = []
    hero_block = re.search(r'<section class="%s-hero".*?</section>' % slug, src, re.S)
    if hero_block:
        for m in re.finditer(r'<a href="(https?://[^"]+)"[^>]*>(.*?)</a>', hero_block.group(0), re.S):
            links.append({"href": m.group(1), "label": txt(m.group(2))})

    stats = []
    for m in re.finditer(r'class="%s">(.*?)</div>\s*<p class="%s">(.*?)</p>'
                         % (cfg["stat_num"], cfg["stat_lab"]), src, re.S):
        stats.append({"n": txt(m.group(1)), "label": txt(m.group(2))})

    # Each content section becomes one card: its heading plus its prose.
    sections = []
    for m in re.finditer(r'<section class="section"[^>]*>(.*?)</section>', src, re.S):
        body = m.group(1)
        h2 = re.search(r'class="section-title"[^>]*>(.*?)</h2>', body, re.S)
        if not h2:
            continue
        paras = [txt(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', body, re.S)]
        paras = [p for p in paras if len(p) > 40][:3]
        items = [txt(li) for li in re.findall(r'<li[^>]*>(.*?)</li>', body, re.S)][:6]
        items = [i for i in items if 3 < len(i) < 120]
        # Some sections are diagrams rather than prose -- the core loop is a row
        # of .loop-step divs with no <p> or <li> anywhere in it.
        steps = [txt(x) for x in
                 re.findall(r'class="loop-step"[^>]*>.*?<span>(.*?)</span>', body, re.S)]
        # Screenshots are content too, and they are already WebP with a JPEG
        # fallback on the desktop page -- reuse both sources, not just the jpg.
        shots = []
        for pic in re.finditer(r'<picture>(.*?)</picture>', body, re.S):
            blk = pic.group(1)
            webp = re.search(r'srcset="([^"]+\.webp)"', blk)
            img = re.search(r'<img[^>]*src="([^"]+)"[^>]*>', blk)
            alt = re.search(r'alt="([^"]*)"', blk)
            dims = re.search(r'width="(\d+)"\s+height="(\d+)"', blk)
            if img:
                shots.append({"webp": webp.group(1) if webp else "",
                              "src": img.group(1),
                              "alt": alt.group(1) if alt else "",
                              "w": dims.group(1) if dims else "",
                              "h": dims.group(2) if dims else ""})
        if not paras and not items and not steps and not shots:
            continue
        sections.append({"title": txt(h2.group(1)), "paras": paras,
                         "items": items, "steps": steps, "shots": shots})

    return {"hero": hero, "links": links, "stats": stats[:6], "sections": sections}


def build_project(slug):
    cfg = PROJECTS[slug]
    d = scrape_project(slug, cfg)

    stats = "".join(f'<li><b>{html.escape(s["n"])}</b><span>{html.escape(s["label"])}</span></li>'
                    for s in d["stats"])
    links = "".join(
        '<a class="{c}" href="{h}" target="_blank" rel="noopener noreferrer">{l}</a>'.format(
            c="primary" if i == 0 else "ghost", h=l["href"], l=html.escape(l["label"]))
        for i, l in enumerate(d["links"][:2]))

    blocks = ""
    for sec in d["sections"]:
        body = "".join(f"<p>{html.escape(p)}</p>" for p in sec["paras"])
        if sec["items"]:
            body += "<ul class='plist'>" + "".join(
                f"<li>{html.escape(i)}</li>" for i in sec["items"]) + "</ul>"
        for sh in sec.get("shots", []):
            src = "../" + sh["src"].lstrip("./")
            webp = ("../" + sh["webp"].lstrip("./")) if sh["webp"] else ""
            dim = f' width="{sh["w"]}" height="{sh["h"]}"' if sh["w"] else ""
            source = f'<source srcset="{webp}" type="image/webp">' if webp else ""
            body += (f'<picture class="pshot">{source}'
                     f'<img src="{src}" alt="{html.escape(sh["alt"])}"{dim} '
                     f'loading="lazy" decoding="async"></picture>')
        if sec.get("steps"):
            body += "<ol class='ploop'>" + "".join(
                f"<li>{html.escape(x)}</li>" for x in sec["steps"]) + "</ol>"
        blocks += f'<section class="pblock"><h2>{html.escape(sec["title"])}</h2>{body}</section>'

    page = PROJECT_TEMPLATE
    for marker, value in (
        ("<!--TITLE-->", html.escape(cfg["title"])),
        ("<!--A-->", cfg["a"]), ("<!--B-->", cfg["b"]),
        ("<!--LOGO-->", html.escape(d["hero"]["logo"])),
        ("<!--TAGLINE-->", html.escape(d["hero"]["tagline"])),
        ("<!--SUBTITLE-->", html.escape(d["hero"]["subtitle"])),
        ("<!--LINKS-->", links),
        ("<!--STATS-->", f'<ul class="pstats">{stats}</ul>' if stats else ""),
        ("<!--BLOCKS-->", blocks),
        ("<!--SLUG-->", slug),
    ):
        page = page.replace(marker, value)

    path = os.path.join(OUT_DIR, slug + ".html")
    open(path, "w").write(page)
    print(f"  m/{slug}.html  {len(d['stats'])} stats, {len(d['sections'])} sections, "
          f"{len(d['links'])} links")
    return path


PROJECT_TEMPLATE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                     "mobile_project_template.html")).read()


if __name__ == "__main__":
    build()
    for _slug in PROJECTS:
        build_project(_slug)
