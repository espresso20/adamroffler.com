// ============================================
// Theme Toggle
// ============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ============================================
// Smooth Scrolling & Active Navigation
// ============================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId.startsWith('#')) return;
        e.preventDefault();
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// Typing Animation
// ============================================
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor');

const textArray = [
    'Principal Cloud Ops Engineer',
    'AWS Architecture & Security',
    'Infrastructure Automation Expert',
    'DevOps & Cloud Architecture',
    'Enterprise Security & Compliance'
];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains('typing')) {
            cursorSpan.classList.add('typing');
        }
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove('typing');
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains('typing')) {
            cursorSpan.classList.add('typing');
        }
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove('typing');
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) {
            textArrayIndex = 0;
        }
        setTimeout(type, typingDelay + 1100);
    }
}

// Start typing animation after page load (only on pages with the element)
document.addEventListener('DOMContentLoaded', () => {
    if (typedTextSpan && textArray.length) {
        setTimeout(type, newTextDelay + 250);
    }
});

// ============================================
// Animated Counters (Metrics + Stats)
// ============================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');

            // Trigger counter animation for metric numbers
            const metrics = entry.target.querySelectorAll('.metric-number');
            metrics.forEach(metric => {
                if (!metric.classList.contains('counted')) {
                    metric.classList.add('counted');
                    animateCounter(metric);
                }
            });
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
const animatedElements = document.querySelectorAll('[data-aos]');
animatedElements.forEach(el => observer.observe(el));

// ============================================
// Hide scroll indicator on scroll
// ============================================
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }, { passive: true });
}

// ============================================
// Parallax effect for hero background
// ============================================
const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, { passive: true });

// ============================================
// Mobile Navigation
// ============================================
function checkMobileNav() {
    const nav = document.querySelector('.nav-menu');
    if (window.innerWidth <= 768) {
        // On mobile, hide nav when scrolling down, show when scrolling up
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                nav.style.transform = 'translateX(-50%) translateY(-100px)';
            } else {
                nav.style.transform = 'translateX(-50%) translateY(0)';
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }
}

checkMobileNav();
window.addEventListener('resize', checkMobileNav);

// ============================================
// Page Load Transition
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Smooth transition when navigating away
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !link.hasAttribute('download')
        && link.hostname === window.location.hostname && !link.getAttribute('target')) {
        e.preventDefault();
        document.body.classList.remove('loaded');
        setTimeout(() => {
            window.location.href = link.href;
        }, 300);
    }
});

// ============================================
// Particle Network Background
// ============================================
const particleCanvas = document.getElementById('particleCanvas');

if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        const hero = particleCanvas.parentElement;
        particleCanvas.width = hero.offsetWidth;
        particleCanvas.height = hero.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(60, Math.floor((particleCanvas.width * particleCanvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        const isDark = html.getAttribute('data-theme') !== 'light';
        const isMatrix = html.classList.contains('matrix-mode');
        const particleColor = isMatrix ? 'rgba(0, 255, 102, 0.5)' : (isDark ? 'rgba(100, 255, 218, 0.5)' : 'rgba(76, 81, 191, 0.4)');
        const lineColor = isMatrix ? 'rgba(0, 255, 102,' : (isDark ? 'rgba(100, 255, 218,' : 'rgba(76, 81, 191,');

        particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = particleCanvas.width;
            if (p.x > particleCanvas.width) p.x = 0;
            if (p.y < 0) p.y = particleCanvas.height;
            if (p.y > particleCanvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = lineColor + (1 - dist / 150) * 0.15 + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

// ============================================
// Interactive Terminal (loops through scenarios)
// ============================================
const terminalBody = document.getElementById('terminalBody');

if (terminalBody) {
    const scenarios = [
        [
            {
                cmd: 'aws sts get-caller-identity',
                output: `{
    <span class="key">"UserId"</span>: <span class="value">"AROA3XFRBF47CLOUD0PS"</span>,
    <span class="key">"Account"</span>: <span class="value">"**** **** 9420"</span>,
    <span class="key">"Arn"</span>: <span class="value">"arn:aws:iam::role/PrincipalCloudOps"</span>
}`
            },
            {
                cmd: 'aws organizations list-accounts --query "length(Accounts)"',
                output: `<span class="value">12</span>`
            }
        ],
        [
            {
                cmd: 'terraform plan -out=infra.tfplan',
                output: `Plan: <span class="value">14 to add</span>, 2 to change, 0 to destroy.`
            },
            {
                cmd: 'terraform apply infra.tfplan',
                output: `<span class="value">Apply complete!</span> Resources: 14 added, 2 changed, 0 destroyed.`
            }
        ],
        [
            {
                cmd: 'kubectl get nodes -o wide | head -5',
                output: `NAME          STATUS   ROLES    VERSION    AGE
eks-node-01   <span class="value">Ready</span>    &lt;none&gt;   v1.29.3    42d
eks-node-02   <span class="value">Ready</span>    &lt;none&gt;   v1.29.3    42d
eks-node-03   <span class="value">Ready</span>    &lt;none&gt;   v1.29.3    42d`
            },
            {
                cmd: 'kubectl get pods -A --field-selector=status.phase=Running | wc -l',
                output: `<span class="value">186</span> pods running`
            }
        ],
        [
            {
                cmd: 'aws guardduty list-findings --query "length(FindingIds)"',
                output: `<span class="value">0</span> active findings`
            },
            {
                cmd: 'aws securityhub get-findings --query "Findings[?Severity.Label==\'CRITICAL\'] | length(@)"',
                output: `<span class="value">0</span> critical findings`
            }
        ],
        [
            {
                cmd: 'gh repo list --limit 5 --json name -q ".[].name"',
                output: `infra-modules
ci-cd-pipelines
security-automation
eks-platform
lambda-toolkit`
            },
            {
                cmd: 'gh run list --limit 3 --json status,conclusion -q ".[] | .status + \\": \\" + .conclusion"',
                output: `completed: <span class="value">success</span>
completed: <span class="value">success</span>
completed: <span class="value">success</span>`
            }
        ]
    ];

    let scenarioIndex = 0;
    let terminalStarted = false;
    let interactive = false;
    const demoTimers = [];

    // Track demo timers so we can stop the auto-feed when the user takes over.
    function track(id) { demoTimers.push(id); return id; }
    function clearDemo() {
        demoTimers.forEach(id => { clearTimeout(id); clearInterval(id); });
        demoTimers.length = 0;
    }

    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function typeCommand(cmdObj, callback) {
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = '<span class="terminal-prompt">$</span><span class="terminal-command"></span>';
        terminalBody.appendChild(newLine);

        const cmdSpan = newLine.querySelector('.terminal-command');
        let i = 0;
        const interval = track(setInterval(() => {
            cmdSpan.textContent += cmdObj.cmd.charAt(i);
            i++;
            if (i >= cmdObj.cmd.length) {
                clearInterval(interval);
                track(setTimeout(() => {
                    const outputDiv = document.createElement('div');
                    outputDiv.className = 'terminal-output';
                    outputDiv.innerHTML = cmdObj.output; // authored constants only
                    terminalBody.appendChild(outputDiv);
                    callback();
                }, 400));
            }
        }, 30));
    }

    function runScenario() {
        if (interactive) return;
        const cmds = scenarios[scenarioIndex];
        let cmdIdx = 0;

        function nextCmd() {
            if (interactive) return;
            if (cmdIdx >= cmds.length) {
                // Pause, then clear and run next scenario
                track(setTimeout(() => {
                    if (interactive) return;
                    terminalBody.innerHTML = '';
                    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
                    runScenario();
                }, 3000));
                return;
            }
            typeCommand(cmds[cmdIdx], () => {
                cmdIdx++;
                track(setTimeout(nextCmd, 800));
            });
        }

        nextCmd();
    }

    // ---- Interactive mode --------------------------------------------------
    const history = [];
    let historyIdx = 0;

    function printOutput(text, isError) {
        const div = document.createElement('div');
        div.className = 'terminal-output' + (isError ? ' terminal-error' : '');
        div.textContent = text; // textContent: user input can never inject markup
        terminalBody.appendChild(div);
        scrollToBottom();
    }

    // Commands wired to real "things". Each returns a string to print (or '').
    const commands = {
        help() {
            return [
                'Available commands:',
                '  whoami      get your IP info',
                '  skills      jump to the tech stack',
                '  projects    jump to projects',
                '  experience  jump to work history',
                '  certs       jump to certifications',
                '  contact     how to reach me',
                '  resume      open my resume',
                '  github      open my GitHub',
                '  linkedin    open my LinkedIn',
                '  theme       toggle dark / light',
                '  clear       clear the screen',
                '  exit        back to the live feed',
                '',
                "  ...and maybe a few more. Neo would approve of the curious. 🕶️",
            ].join('\n');
        },
        async whoami() {
            try {
                const response = await fetch('https://ipapi.co/json/', {
                    signal: AbortSignal.timeout(5000)
                });
                if (!response.ok) throw new Error('API request failed');
                const data = await response.json();

                return [
                    `IP Address: ${data.ip || 'Unknown'}`,
                    `Location:   ${data.city || '?'}, ${data.region || '?'}, ${data.country_name || '?'}`,
                    `ISP:        ${data.org || 'Unknown'}`,
                    `Timezone:   ${data.timezone || 'Unknown'}`,
                ].join('\n');
            } catch (error) {
                return 'Unable to fetch IP info (network error or API unavailable)';
            }
        },
        about()      { goTo('#about');          return 'Scrolling to About...'; },
        skills()     { goTo('#skills');         return 'Opening the tech stack...'; },
        projects()   { goTo('#projects');       return 'Loading projects...'; },
        experience() { goTo('#experience');     return 'Pulling up work history...'; },
        certs()        { goTo('#certifications'); return 'Showing certifications...'; },
        certifications() { return this.certs(); },
        contact()    { goTo('#contact');        return 'Reach me at espresso20@pm.me'; },
        email()      { window.location.href = 'mailto:espresso20@pm.me'; return 'Opening mail client...'; },
        resume()     { window.open('resume.html', '_blank', 'noopener'); return 'Opening resume in a new tab...'; },
        cv()         { return this.resume(); },
        github()     { window.open('https://github.com/espresso20', '_blank', 'noopener'); return 'Opening GitHub...'; },
        linkedin()   { window.open('https://www.linkedin.com/in/adam-roffler/', '_blank', 'noopener'); return 'Opening LinkedIn...'; },
        cloud()      { window.location.href = 'aws-cloud.html'; return 'Entering the cloud...'; },
        theme(args) {
            const target = (args[0] || '').toLowerCase();
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = (target === 'dark' || target === 'light') ? target : (current === 'dark' ? 'light' : 'dark');
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            if (typeof updateThemeIcon === 'function') updateThemeIcon(next);
            return `Theme set to ${next}.`;
        },
        echo(args)   { return args.join(' '); },
        date()       { return new Date().toString(); },
        sudo()       { return "Nice try. You don't have root here. 😏"; },
        // --- hidden easter eggs (not listed in help) ---
        matrix(args) {
            const arg = (args[0] || '').toLowerCase();
            if (arg === 'off') { stopMatrix(); return 'Disconnecting... welcome back to reality.'; }
            if (arg === 'on')  { startMatrix(); return 'Wake up, Neo... the matrix is now your background. (type "matrix off" to leave)'; }
            return toggleMatrix()
                ? 'Wake up, Neo... the matrix is now your background. (type "matrix off" to leave)'
                : 'Disconnecting... welcome back to reality.';
        },
        hire()       { showRecruitMessage(); return ''; },
    };

    function goTo(selector) {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function runCommand(raw) {
        const value = raw.trim();
        if (value) { history.push(value); historyIdx = history.length; }

        if (value === '') { newPrompt(); return; }
        if (value === 'clear') { terminalBody.innerHTML = ''; newPrompt(); return; }
        if (value === 'exit') {
            interactive = false;
            terminalBody.innerHTML = '';
            scenarioIndex = 0;
            runScenario();
            return;
        }

        const parts = value.split(/\s+/);
        const name = parts[0].toLowerCase();
        const args = parts.slice(1);
        const handler = commands[name];

        if (handler) {
            let out = '';
            try {
                const result = handler.call(commands, args);
                // Handle both sync and async commands
                out = (result instanceof Promise ? await result : result) || '';
            }
            catch (e) { out = 'Error running command.'; }
            if (out) printOutput(out);
        } else {
            printOutput(`command not found: ${name}  —  type 'help' for options`, true);
        }
        newPrompt();
    }

    function newPrompt() {
        const line = document.createElement('div');
        line.className = 'terminal-line terminal-input-line';

        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = '$';

        const input = document.createElement('input');
        input.className = 'terminal-input';
        input.type = 'text';
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('spellcheck', 'false');
        input.setAttribute('aria-label', 'Terminal command input');

        line.appendChild(prompt);
        line.appendChild(input);
        terminalBody.appendChild(line);
        input.focus();
        scrollToBottom();

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = input.value;
                const frozen = document.createElement('span');
                frozen.className = 'terminal-command';
                frozen.textContent = value;
                line.replaceChild(frozen, input);
                runCommand(value);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIdx > 0) { historyIdx--; input.value = history[historyIdx] || ''; }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIdx < history.length) { historyIdx++; input.value = history[historyIdx] || ''; }
            }
        });
    }

    function enterInteractive() {
        if (interactive) return;
        interactive = true;
        clearDemo();
        terminalBody.innerHTML = '';
        const hintEl = document.getElementById('terminalHint');
        if (hintEl) hintEl.style.display = 'none';
        printOutput("adam@cloud-ops — type 'help' to get started.");
        newPrompt();
    }

    // Click anywhere in the terminal to take over
    const terminalEl = terminalBody.closest('.terminal');
    terminalEl.addEventListener('click', () => {
        if (!interactive) enterInteractive();
        else {
            const input = terminalBody.querySelector('.terminal-input');
            if (input) input.focus();
        }
    });

    // Start the auto-demo when visible
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !terminalStarted && !interactive) {
                terminalStarted = true;
                terminalBody.innerHTML = '';
                runScenario();
            }
        });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminalEl);
}

// ============================================
// Matrix rain background (toggled via terminal: `matrix`)
// Runs behind the page content and persists across visits via localStorage.
// ============================================
const MATRIX_KEY = 'matrixMode';
let matrixActive = false;
let stopMatrixImpl = null;

function startMatrix(persist = true) {
    if (matrixActive) return;
    matrixActive = true;

    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    // Attach to <html> and let the .matrix-mode class turn it into the page background
    document.documentElement.appendChild(canvas);
    document.documentElement.classList.add('matrix-mode');
    const ctx = canvas.getContext('2d');

    function size() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    size();

    // Radial fade: trails linger (brighter) in the center and decay faster at
    // the edges, giving the whole field an atmospheric, focused-depth glow.
    let fadeGradient;
    function buildFade() {
        const cx = canvas.width / 2, cy = canvas.height / 2;
        const r = Math.hypot(cx, cy);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, 'rgba(0, 0, 0, 0.045)');
        g.addColorStop(1, 'rgba(0, 0, 0, 0.13)');
        fadeGradient = g;
    }
    buildFade();

    const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFｦｧｨｩ$+*=<>'.split('');

    // Three depth layers, drawn far -> near. Far layers are smaller, dimmer
    // and slower; near layers are larger, brighter, faster -> parallax depth.
    const layerDefs = [
        { fontSize: 11, speed: 0.12, head: '170, 255, 200', tail: '0, 150, 70',  glow: 0,  resetChance: 0.985 },
        { fontSize: 16, speed: 0.25, head: '200, 255, 215', tail: '0, 200, 95',  glow: 0,  resetChance: 0.975 },
        { fontSize: 24, speed: 0.40, head: '225, 255, 235', tail: '20, 255, 120', glow: 12, resetChance: 0.965 },
    ];

    function buildLayer(def) {
        const columns = Math.ceil(canvas.width / def.fontSize) + 1;
        const drops = new Array(columns);
        for (let i = 0; i < columns; i++) {
            // Stagger initial positions so the layers don't start in lockstep.
            drops[i] = Math.random() * -canvas.height / def.fontSize;
        }
        return { ...def, columns, drops };
    }

    let layers = layerDefs.map(buildLayer);
    let raf;

    function drawLayer(layer) {
        ctx.font = `${layer.fontSize}px monospace`;
        ctx.shadowColor = layer.glow ? `rgba(${layer.tail}, 0.9)` : 'transparent';
        for (let i = 0; i < layer.columns; i++) {
            const x = i * layer.fontSize;
            const y = layer.drops[i] * layer.fontSize;
            const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];

            // Bright leading character with optional glow...
            ctx.shadowBlur = layer.glow;
            ctx.fillStyle = `rgb(${layer.head})`;
            ctx.fillText(glyph, x, y);

            // ...and a dimmer character just behind it to thicken the trail.
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgb(${layer.tail})`;
            ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x, y - layer.fontSize);

            if (y > canvas.height && Math.random() > layer.resetChance) layer.drops[i] = 0;
            layer.drops[i] += layer.speed;
        }
    }

    function draw() {
        // Soft radial fade leaves trailing streaks and focuses depth at center.
        ctx.fillStyle = fadeGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (const layer of layers) drawLayer(layer);
        ctx.shadowBlur = 0;
        raf = requestAnimationFrame(draw);
    }
    draw();

    function onResize() {
        size();
        buildFade();
        layers = layerDefs.map(buildLayer);
    }
    window.addEventListener('resize', onResize);

    // Closure that fully tears the background down again.
    stopMatrixImpl = function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        canvas.remove();
        document.documentElement.classList.remove('matrix-mode');
        matrixActive = false;
        stopMatrixImpl = null;
    };

    if (persist) {
        try { localStorage.setItem(MATRIX_KEY, 'on'); } catch (e) {}
    }
}

function stopMatrix() {
    if (stopMatrixImpl) stopMatrixImpl();
    try { localStorage.removeItem(MATRIX_KEY); } catch (e) {}
}

function toggleMatrix() {
    if (matrixActive) { stopMatrix(); return false; }
    startMatrix();
    return true;
}

// Restore the matrix background if it was left on during a previous visit.
try {
    if (localStorage.getItem(MATRIX_KEY) === 'on') startMatrix(false);
} catch (e) {}

// ============================================
// Secret recruiting message (triggered via terminal: `hire`)
// ============================================
function showRecruitMessage() {
    if (document.querySelector('.recruit-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'recruit-overlay';

    const card = document.createElement('div');
    card.className = 'recruit-card glass-card';

    const close = document.createElement('button');
    close.className = 'recruit-close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '✕';

    const h = document.createElement('h3');
    h.textContent = 'You found the secret. 🎯';

    const p1 = document.createElement('p');
    p1.textContent = "Most people just scroll. You went digging — that's exactly the kind of curiosity I like to work with.";

    const p2 = document.createElement('p');
    p2.textContent = "If you're hiring (or just want to talk cloud, automation, or terminal games), let's talk:";

    const cta = document.createElement('a');
    cta.className = 'btn btn-primary';
    cta.href = 'mailto:espresso20@pm.me';
    cta.textContent = 'espresso20@pm.me';

    card.append(close, h, p1, p2, cta);
    overlay.appendChild(card);
    document.documentElement.appendChild(overlay);

    function dismiss() {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') dismiss(); }

    close.addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
    document.addEventListener('keydown', onKey);
}

// ============================================
// GitHub Repositories
// ============================================
const githubReposContainer = document.getElementById('github-repos');

if (githubReposContainer) {
    const GITHUB_USER = 'espresso20';
    const CACHE_KEY = 'github-repos';
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    const MAX_REPOS = 6;

    const languageColors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Go': '#00ADD8',
        'HCL': '#844FBA',
        'Shell': '#89e051',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Dockerfile': '#384d54',
        'Makefile': '#427819',
        'Ruby': '#701516',
        'Rust': '#dea584',
        'Java': '#b07219'
    };

    function showSkeletons() {
        githubReposContainer.innerHTML = '';
        for (let i = 0; i < MAX_REPOS; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            skeleton.setAttribute('data-aos', 'fade-up');
            skeleton.setAttribute('data-aos-delay', String((i + 1) * 100));
            githubReposContainer.appendChild(skeleton);
        }
    }

    function renderRepos(repos) {
        githubReposContainer.innerHTML = '';
        repos.forEach((repo, i) => {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'repo-card glass-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', String((i + 1) * 100));

            const desc = repo.description
                ? (repo.description.length > 100 ? repo.description.substring(0, 100) + '...' : repo.description)
                : 'No description';

            let footerHTML = '';
            if (repo.language) {
                const color = languageColors[repo.language] || '#8b949e';
                footerHTML += `<span><span class="repo-language-dot" style="background: ${color};"></span>${repo.language}</span>`;
            }
            if (repo.stargazers_count > 0) {
                footerHTML += `<span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>`;
            }
            if (repo.forks_count > 0) {
                footerHTML += `<span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>`;
            }

            card.innerHTML = `
                <div>
                    <h3>${repo.name}</h3>
                    <p>${desc}</p>
                </div>
                <div class="repo-card-footer">${footerHTML}</div>
            `;

            githubReposContainer.appendChild(card);
        });

        // Re-observe new elements for scroll animations
        githubReposContainer.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    }

    function showError() {
        githubReposContainer.innerHTML = `
            <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p style="color: var(--text-secondary); margin-bottom: 15px;">Unable to load repositories</p>
                <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: inline-block;">
                    <i class="fab fa-github" style="margin-right: 8px;"></i>View on GitHub
                </a>
            </div>
        `;
    }

    async function fetchRepos() {
        // Check cache
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
                renderRepos(data);
                return;
            }
        }

        showSkeletons();

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const allRepos = await response.json();

            const repos = allRepos
                .filter(repo => !repo.fork)
                .slice(0, MAX_REPOS);

            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: repos, timestamp: Date.now() }));
            renderRepos(repos);
        } catch (err) {
            showError();
        }
    }

    fetchRepos();
}

// ============================================
// Starfield Canvas (Ageforge page)
// ============================================
const starfieldCanvas = document.getElementById('starfieldCanvas');

if (starfieldCanvas) {
    const sCtx = starfieldCanvas.getContext('2d');
    let stars = [];

    function resizeStarfield() {
        const parent = starfieldCanvas.parentElement;
        starfieldCanvas.width = parent.offsetWidth;
        starfieldCanvas.height = parent.offsetHeight;
    }

    function createStars() {
        stars = [];
        const count = Math.min(120, Math.floor((starfieldCanvas.width * starfieldCanvas.height) / 8000));
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * starfieldCanvas.width,
                y: Math.random() * starfieldCanvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vy: Math.random() * 0.3 + 0.1,
                vx: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.6 + 0.4
            });
        }
    }

    function drawStarfield() {
        sCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

        stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;

            if (star.y > starfieldCanvas.height) {
                star.y = 0;
                star.x = Math.random() * starfieldCanvas.width;
            }
            if (star.x < 0) star.x = starfieldCanvas.width;
            if (star.x > starfieldCanvas.width) star.x = 0;

            sCtx.beginPath();
            sCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            sCtx.fillStyle = isDark
                ? `rgba(240, 165, 0, ${star.opacity * 0.5})`
                : `rgba(200, 132, 0, ${star.opacity * 0.4})`;
            sCtx.fill();
        });

        requestAnimationFrame(drawStarfield);
    }

    resizeStarfield();
    createStars();
    drawStarfield();

    window.addEventListener('resize', () => {
        resizeStarfield();
        createStars();
    });
}

// ============================================
// Add easter egg: Konami code
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiSequence.length);

    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

let easterEggActive = false;

function activateEasterEgg() {
    if (easterEggActive) return;
    easterEggActive = true;

    // 1. Rainbow color flash across the whole page
    document.body.style.animation = 'rainbow 2s linear infinite';

    // 2. Giant centered "KONAMI" banner.
    // Attach to <html>, NOT <body>: the rainbow filter on <body> would make it
    // the containing block for fixed children, breaking viewport centering.
    const banner = document.createElement('div');
    banner.className = 'konami-banner';
    banner.textContent = 'KONAMI';
    document.documentElement.appendChild(banner);

    // 3. After the banner, sweep the Konami arrow sequence across the screen
    const ARROWS = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'];
    const BANNER_MS = 3000;

    setTimeout(() => {
        banner.classList.add('konami-banner-out');
        setTimeout(() => banner.remove(), 500);

        const arrowLayer = document.createElement('div');
        arrowLayer.className = 'konami-arrow-layer';
        document.documentElement.appendChild(arrowLayer);

        ARROWS.forEach((symbol, i) => {
            setTimeout(() => {
                const el = document.createElement('span');
                el.className = 'konami-arrow';
                el.textContent = symbol;
                arrowLayer.appendChild(el);
                // Clean up each arrow after it finishes flying
                setTimeout(() => el.remove(), 1200);
            }, i * 180);
        });

        // Tear down the arrow layer and stop the rainbow once the sweep ends
        const totalArrowTime = ARROWS.length * 180 + 1200;
        setTimeout(() => {
            arrowLayer.remove();
            document.body.style.animation = '';
            easterEggActive = false;
        }, totalArrowTime);
    }, BANNER_MS);
}

// Add easter egg animations + styling
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }

    .konami-banner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.3);
        z-index: 100000;
        font-size: clamp(3rem, 18vw, 14rem);
        font-weight: 900;
        letter-spacing: 0.1em;
        font-family: 'Courier New', monospace;
        background: linear-gradient(135deg, #ff0080, #ff8c00, #ffe600, #00ff88, #00cfff, #8a2be2);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
        filter: drop-shadow(0 0 30px rgba(255, 0, 128, 0.6));
        pointer-events: none;
        opacity: 0;
        animation: konamiPop 0.5s cubic-bezier(0.18, 1.5, 0.5, 1) forwards,
                   konamiGradient 3s linear infinite,
                   konamiPulse 0.8s ease-in-out 0.5s infinite alternate;
    }

    .konami-banner-out {
        animation: konamiOut 0.5s ease forwards !important;
    }

    @keyframes konamiPop {
        0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.3) rotate(-8deg); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
    }

    @keyframes konamiPulse {
        from { transform: translate(-50%, -50%) scale(1); }
        to   { transform: translate(-50%, -50%) scale(1.08); }
    }

    @keyframes konamiGradient {
        0%   { background-position: 0% 50%; }
        100% { background-position: 300% 50%; }
    }

    @keyframes konamiOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to   { opacity: 0; transform: translate(-50%, -50%) scale(2.2); }
    }

    .konami-arrow-layer {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100000;
        pointer-events: none;
        display: flex;
        gap: 0.15em;
        font-size: clamp(2.5rem, 10vw, 8rem);
        font-weight: 900;
        font-family: 'Courier New', monospace;
    }

    .konami-arrow {
        display: inline-block;
        opacity: 0;
        color: #fff;
        text-shadow: 0 0 20px #00cfff, 0 0 40px #ff0080;
        animation: konamiArrow 1.2s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
    }

    @keyframes konamiArrow {
        0%   { opacity: 0; transform: translateY(60px) scale(0.4); }
        25%  { opacity: 1; transform: translateY(0) scale(1.3); }
        70%  { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-50px) scale(0.8); }
    }

    @media (prefers-reduced-motion: reduce) {
        .konami-banner, .konami-arrow {
            animation-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);
