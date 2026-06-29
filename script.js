document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (navToggle && mobileMenu && mobileClose) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        mobileClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = ''; // Restore scrolling
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Navbar Scrolled State
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Scroll Reveal Animations
    const fadeUpElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    fadeUpElements.forEach(el => revealObserver.observe(el));

    // 4. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasAnimatedCounters = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedCounters) {
                hasAnimatedCounters = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
});

// Form Handlers
function handleNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('emailInput');
    const msg = document.getElementById('newsletterMsg');
    
    if (emailInput.value) {
        // Simulate API call
        const btn = event.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i>';
        
        setTimeout(() => {
            msg.style.display = 'block';
            emailInput.value = '';
            btn.innerHTML = originalText;
            setTimeout(() => { msg.style.display = 'none'; }, 4000);
        }, 1000);
    }
}

function handleContact(btn) {
    const wrap = btn.closest('.row');
    const inputs = wrap.querySelectorAll('input, select, textarea');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.value && input.tagName !== 'SELECT') {
            valid = false;
        }
    });

    if (valid) {
        const msg = document.getElementById('contactMsg');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        
        setTimeout(() => {
            msg.style.display = 'block';
            inputs.forEach(input => {
                if(input.tagName !== 'SELECT') input.value = '';
            });
            btn.innerHTML = originalText;
            setTimeout(() => { msg.style.display = 'none'; }, 5000);
        }, 1500);
    } else {
        alert("Please fill in all fields before submitting.");
    }
}
