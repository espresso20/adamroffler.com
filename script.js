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
        const particleColor = isDark ? 'rgba(100, 255, 218, 0.5)' : 'rgba(76, 81, 191, 0.4)';
        const lineColor = isDark ? 'rgba(100, 255, 218,' : 'rgba(76, 81, 191,';

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

    function typeCommand(cmdObj, callback) {
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = '<span class="terminal-prompt">$</span><span class="terminal-command"></span>';
        terminalBody.appendChild(newLine);

        const cmdSpan = newLine.querySelector('.terminal-command');
        let i = 0;
        const interval = setInterval(() => {
            cmdSpan.textContent += cmdObj.cmd.charAt(i);
            i++;
            if (i >= cmdObj.cmd.length) {
                clearInterval(interval);
                setTimeout(() => {
                    const outputDiv = document.createElement('div');
                    outputDiv.className = 'terminal-output';
                    outputDiv.innerHTML = cmdObj.output;
                    terminalBody.appendChild(outputDiv);
                    callback();
                }, 400);
            }
        }, 30);
    }

    function runScenario() {
        const cmds = scenarios[scenarioIndex];
        let cmdIdx = 0;

        function nextCmd() {
            if (cmdIdx >= cmds.length) {
                // Pause, then clear and run next scenario
                setTimeout(() => {
                    terminalBody.innerHTML = '';
                    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
                    runScenario();
                }, 3000);
                return;
            }
            typeCommand(cmds[cmdIdx], () => {
                cmdIdx++;
                setTimeout(nextCmd, 800);
            });
        }

        nextCmd();
    }

    // Start terminal animation when visible
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !terminalStarted) {
                terminalStarted = true;
                terminalBody.innerHTML = '';
                runScenario();
            }
        });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminalBody.closest('.terminal'));
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

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
