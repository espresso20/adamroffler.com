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
        projects.append({"key": m.group(1), "href": m.group(2)})

    return {"jobs": jobs, "skills": skills, "certs": certs, "about": about, "projects": projects}


PROJECT_META = {
    "ageforge":   ("AgeForge",   "Idle empire builder in Go",        "#f0a500", "#ff6b35"),
    "abend":      ("ABEND",      "Command-line civilization sim",     "#00ff41", "#39ffb0"),
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
    print(f"  m/index.html  {len(d['jobs'])} roles, {len(d['skills'])} skills, "
          f"{len(d['certs'])} certs, {len(d['projects'])} projects")
    return path


TEMPLATE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             "mobile_template.html")).read()

if __name__ == "__main__":
    build()
