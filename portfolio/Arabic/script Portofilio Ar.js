// =====================================================
// LIQUID GLASS PORTFOLIO — JavaScript
// =====================================================

// EmailJS Config — REPLACE WITH YOUR KEYS
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
    SERVICE_ID: 'YOUR_SERVICE_ID',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID'
};

// Initialize EmailJS if key is provided
if (EMAILJS_CONFIG.PUBLIC_KEY && !EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// =====================================================
// MOBILE MENU
// =====================================================
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('menuOverlay');
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
        menu.classList.remove('open');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    }
}

// =====================================================
// NAV SCROLL EFFECT
// =====================================================
const nav = document.querySelector('.nav-glass');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// =====================================================
// SCROLL REVEAL
// =====================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate skill bars if inside
            const fills = entry.target.querySelectorAll('.skill-fill');
            fills.forEach(fill => {
                const width = fill.dataset.width;
                if (width) fill.style.width = width + '%';
            });
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// =====================================================
// PARTICLES
// =====================================================
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 25 + 15) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(p);
    }
}

// =====================================================
// CONTACT FORM
// =====================================================
async function handleContact(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const btn = document.getElementById('contactBtn');
    const btnText = document.getElementById('contactBtnText');
    const btnIcon = document.getElementById('contactBtnIcon');
    const successDiv = document.getElementById('contactSuccess');
    const errorDiv = document.getElementById('contactError');
    const errorText = document.getElementById('contactErrorText');

    successDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');

    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')) {
        // Demo mode — simulate success
        btn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.classList.add('hidden');
        btn.classList.add('opacity-75');

        setTimeout(() => {
            btn.disabled = false;
            btnText.textContent = 'Sent!';
            btnIcon.classList.remove('hidden');
            btnIcon.setAttribute('data-lucide', 'check');
            btn.classList.remove('opacity-75');
            successDiv.classList.remove('hidden');
            document.getElementById('contactForm').reset();
            lucide.createIcons();

            setTimeout(() => {
                btnText.textContent = 'Send Message';
                btnIcon.setAttribute('data-lucide', 'send');
                successDiv.classList.add('hidden');
                lucide.createIcons();
            }, 4000);
        }, 1500);
        return;
    }

    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.classList.add('hidden');
    btn.classList.add('opacity-75');

    try {
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'your@email.com'
        });

        btn.disabled = false;
        btnText.textContent = 'Sent!';
        btnIcon.classList.remove('hidden');
        btnIcon.setAttribute('data-lucide', 'check');
        btn.classList.remove('opacity-75');
        successDiv.classList.remove('hidden');
        document.getElementById('contactForm').reset();
        lucide.createIcons();

        setTimeout(() => {
            btnText.textContent = 'Send Message';
            btnIcon.setAttribute('data-lucide', 'send');
            successDiv.classList.add('hidden');
            lucide.createIcons();
        }, 4000);
    } catch (err) {
        btn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.classList.remove('hidden');
        btn.classList.remove('opacity-75');
        errorText.textContent = err.text || 'Failed to send. Please try again.';
        errorDiv.classList.remove('hidden');
        lucide.createIcons();
    }
}

// =====================================================
// TOAST
// =====================================================
function showToast(title, message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// =====================================================
// SMOOTH SCROLL FOR ANCHORS
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    createParticles();
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        document.getElementById('mobileMenu').classList.remove('open');
        document.getElementById('menuOverlay').classList.add('hidden');
        document.body.style.overflow = '';
    }
});
