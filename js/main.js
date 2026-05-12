// =========================================================
// TechMate — Main JavaScript
// =========================================================

// --- Navbar: transparent → solid on scroll ---
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// --- Mobile hamburger menu ---
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

function openMenu() {
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
}

hamburger.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Close menu on any nav link click
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking the overlay (body::before)
document.addEventListener('click', (e) => {
    if (document.body.classList.contains('menu-open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
    }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});


// --- Scroll Reveal Animation ---
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Stagger siblings of the same type in a grid/flex parent
        const parent = entry.target.parentElement;
        const siblingReveals = [...parent.children].filter(el => el.classList.contains('reveal'));
        const index = siblingReveals.indexOf(entry.target);

        entry.target.style.transitionDelay = index > 0 ? `${index * 0.12}s` : '0s';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


// --- Animated Counters ---
function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.querySelector('span')?.textContent ?? '';
    const duration = 1800;
    const interval = 16;
    const steps    = duration / interval;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.innerHTML = `${Math.floor(current)}<span>${suffix}</span>`;
        if (current >= target) clearInterval(timer);
    }, interval);
}

// Trigger counters when the stats grid enters the viewport
const statsGrid = document.querySelector('.why-stats');

if (statsGrid) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            statsGrid.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.35 });

    counterObserver.observe(statsGrid);
}


// --- Active Nav Link on Scroll ---
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);

        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}, { passive: true });
