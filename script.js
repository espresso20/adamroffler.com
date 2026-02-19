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
