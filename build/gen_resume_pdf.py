#!/usr/bin/env python3
"""Generate adam-roffler-resume.pdf from resume.html.

The PDF used to be exported by hand from a Word file, so it drifted from the
resume page (old address, old title, no current job). This reads the page's
content -- header, summary, jobs, skills, certifications, education -- lays it
out as a plain, ATS-friendly print document and prints it with headless Chrome.

    python3 build/gen_resume_pdf.py

Needs Google Chrome or Chromium on PATH (or CHROME=/path/to/chrome).
Public file: no phone number, no references' contact details.
"""
import os, re, html, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "resume.html")
OUT = os.path.join(ROOT, "adam-roffler-resume.pdf")

EMAIL = "espresso20@pm.me"
LINKEDIN = "linkedin.com/in/adam-roffler"
SITE = "adamroffler.com"


def txt(h):
    h = re.sub(r"<[^>]+>", " ", h)
    h = html.unescape(h)
    return re.sub(r"\s+", " ", h).strip()


def section(s, sid):
    m = re.search(r'<section id="%s".*?</section>' % sid, s, re.S)
    if not m:
        sys.exit("resume.html: no #%s section" % sid)
    return m.group(0)


def scrape():
    s = open(SRC, encoding="utf-8").read()
    d = {}
    d["title"] = txt(re.search(r'<p class="lede">(.*?)</p>', s, re.S).group(1))
    hero = re.search(r'<section class="page-hero">.*?</section>', s, re.S).group(0)
    d["location"] = txt(re.findall(r"<li>([^<]*)</li>", hero)[-1])
    d["summary"] = txt(re.search(r"<p>(.*?)</p>", section(s, "summary"), re.S).group(1))

    jobs = []
    for b in re.split(r'<li class="job">', section(s, "experience"))[1:]:
        t = re.search(r"<h3>(.*?)</h3>", b, re.S)
        co = re.search(r'class="job-org">(.*?)</p>', b, re.S)
        meta = re.search(r'class="job-meta">(.*?)</div>', b, re.S)
        if not (t and co and meta):
            continue
        parts = [txt(x) for x in re.split(r"<br\s*/?>", meta.group(1))]
        jobs.append({
            "title": txt(t.group(1)),
            "company": txt(co.group(1)),
            "location": parts[1] if len(parts) > 1 else "",
            "dates": parts[0],
            "bullets": [txt(li) for li in re.findall(r"<li>(.*?)</li>", b, re.S)],
        })
    if not jobs:
        sys.exit("resume.html: no jobs found")
    d["jobs"] = jobs

    groups = re.findall(r'<ul class="tags">(.*?)</ul>', section(s, "skills"), re.S)
    if len(groups) != 2:
        sys.exit("resume.html: expected 2 skill groups, found %d" % len(groups))
    d["tech"], d["top"] = ([txt(t) for t in re.findall(r"<li>(.*?)</li>", g, re.S)] for g in groups)

    cs = section(s, "certifications")
    certs = []
    f = re.search(r'<a class="cert-feature".*?</a>', cs, re.S)
    if f:
        spans = re.findall(r"<span>(.*?)</span>", f.group(0), re.S)
        certs.append((txt(re.search(r"<strong>(.*?)</strong>", f.group(0), re.S).group(1)),
                      txt(spans[0]) if spans else ""))
    for b in re.findall(r"<li>(.*?)</li>", cs, re.S):
        name = txt(re.search(r"<strong>(.*?)</strong>", b, re.S).group(1))
        date = re.search(r"<span>(.*?)</span>", b, re.S)
        certs.append((name, txt(date.group(1)) if date else ""))
    d["certs"] = certs

    ed = section(s, "education")
    d["edu"] = (txt(re.search(r"<h3>(.*?)</h3>", ed, re.S).group(1)),
                txt(re.search(r'class="job-org">(.*?)</p>', ed, re.S).group(1)),
                txt(re.search(r'class="job-meta">(.*?)</div>', ed, re.S).group(1)))
    return d


CSS = """
@page { size: Letter; margin: 0.45in 0.55in; }
* { box-sizing: border-box; }
body { font-family: "Inter", "Helvetica Neue", Arial, sans-serif; font-size: 9.2pt;
       line-height: 1.3; color: #1d2330; margin: 0; }
a { color: inherit; text-decoration: none; }
h1 { font-size: 21pt; margin: 0; letter-spacing: -0.2px; color: #0f1b2d; }
.headline { font-size: 9.8pt; color: #1f5fbf; font-weight: 600; margin: 2px 0 4px; }
.contact { font-size: 9pt; color: #4a5568; }
.contact span + span::before { content: "  |  "; color: #a0aec0; }
h2 { font-size: 10pt; letter-spacing: 1.4px; text-transform: uppercase; color: #1f5fbf;
     border-bottom: 1.2px solid #1f5fbf; padding-bottom: 2px; margin: 10px 0 4px; }
p { margin: 0; }
.co { font-weight: 700; font-size: 10.2pt; margin-top: 6px; color: #0f1b2d; }
.role { display: flex; justify-content: space-between; align-items: baseline; margin-top: 3px; }
.role b { font-size: 9.9pt; }
.role span { color: #4a5568; font-size: 9pt; white-space: nowrap; padding-left: 12px; }
ul { margin: 2px 0 0; padding-left: 15px; }
li { margin: 1px 0; }
.job { break-inside: avoid; }
.skills p { margin: 2px 0; }
.certs { columns: 2; column-gap: 24px; padding-left: 15px; }
.certs li { break-inside: avoid; }
.muted { color: #4a5568; }
"""


def render(d):
    e = html.escape
    out = ["<!DOCTYPE html><html><head><meta charset='utf-8'><title>Adam Roffler - Resume</title>",
           "<style>%s</style></head><body>" % CSS,
           "<h1>Adam Roffler</h1>",
           "<p class='headline'>%s</p>" % e(d["title"]),
           "<p class='contact'><span>%s</span><span><a href='mailto:%s'>%s</a></span>"
           "<span><a href='https://www.%s/'>%s</a></span><span><a href='https://%s'>%s</a></span></p>"
           % (e(d["location"]), EMAIL, EMAIL, LINKEDIN, LINKEDIN, SITE, SITE),
           "<h2>Summary</h2><p>%s</p>" % e(d["summary"]),
           "<h2>Experience</h2>"]
    prev = None
    for j in d["jobs"]:
        out.append("<div class='job'>")
        if j["company"] != prev:
            out.append("<div class='co'>%s</div>" % e(j["company"]))
            prev = j["company"]
        meta = " · ".join(x for x in (j["location"], j["dates"]) if x)
        out.append("<div class='role'><b>%s</b><span>%s</span></div>" % (e(j["title"]), e(meta)))
        if j["bullets"]:
            out.append("<ul>%s</ul>" % "".join("<li>%s</li>" % e(b) for b in j["bullets"]))
        out.append("</div>")
    out.append("<div class='skills'><h2>Skills</h2>"
               "<p><b>Technology:</b> %s</p><p><b>Strengths:</b> %s</p></div>"
               % (e(", ".join(d["tech"])), e(", ".join(d["top"]))))
    out.append("<h2>Certifications</h2><ul class='certs'>%s</ul>" % "".join(
        "<li>%s%s</li>" % (e(n), " <span class='muted'>(%s)</span>" % e(dt) if dt else "")
        for n, dt in d["certs"]))
    school, field, years = d["edu"]
    out.append("<h2>Education</h2><div class='role'><b>%s</b><span>%s</span></div><p class='muted'>%s</p>"
               % (e(school), e(years), e(field)))
    out.append("<p class='muted' style='margin-top:12px'>References available on request.</p>")
    out.append("</body></html>")
    return "\n".join(out)


def chrome():
    for c in (os.environ.get("CHROME"), "google-chrome", "chromium", "chromium-browser",
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"):
        if c and (shutil.which(c) or os.path.exists(c)):
            return shutil.which(c) or c
    sys.exit("Chrome/Chromium not found; set CHROME=/path/to/chrome")


def main():
    d = scrape()
    with tempfile.TemporaryDirectory() as tmp:
        page = os.path.join(tmp, "resume_print.html")
        open(page, "w", encoding="utf-8").write(render(d))
        subprocess.run([chrome(), "--headless=new", "--disable-gpu", "--no-sandbox",
                        "--no-pdf-header-footer", "--print-to-pdf=" + OUT, "file://" + page],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("  %s  %d jobs, %d certs" % (os.path.relpath(OUT, ROOT), len(d["jobs"]), len(d["certs"])))


if __name__ == "__main__":
    main()
