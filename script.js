document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────────────────────────
    // 1. ACTIVE NAV LINK (highlight current page)
    // ──────────────────────────────────────────────────
    const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || '';
    document.querySelectorAll('.nav-links a, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const hrefPage = href.split('/').pop().split('#')[0];
        if (hrefPage === currentPath || (currentPath === '' && (hrefPage === '' || hrefPage === '/'))) {
            link.classList.add('nav-active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // ──────────────────────────────────────────────────
    // 2. MOBILE MENU TOGGLE
    // ──────────────────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navIcon = document.getElementById('navIcon');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (navToggle && mobileMenu && navIcon) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            if (mobileMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
                navIcon.classList.replace('bi-list', 'bi-x-lg');
            } else {
                document.body.style.overflow = '';
                navIcon.classList.replace('bi-x-lg', 'bi-list');
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
                navIcon.classList.replace('bi-x-lg', 'bi-list');
            });
        });
    }

    // ──────────────────────────────────────────────────
    // 3. NAVBAR SCROLLED STATE
    // ──────────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load
    }

    // ──────────────────────────────────────────────────
    // 4. SCROLL REVEAL ANIMATIONS
    // ──────────────────────────────────────────────────
    const fadeElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeElements.forEach(el => revealObserver.observe(el));

    // ──────────────────────────────────────────────────
    // 5. CUSTOM CURSOR (desktop only)
    // ──────────────────────────────────────────────────
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', e => {
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                setTimeout(() => {
                    cursorDot.style.left = `${e.clientX}px`;
                    cursorDot.style.top = `${e.clientY}px`;
                }, 40);
            });
        });

        const interactiveElements = document.querySelectorAll('a, button, .eco-card, .workflow-item, .faq-question, .news-card, .artist-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorDot.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorDot.classList.remove('hover'); });
        });

        document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorDot.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorDot.style.opacity = '1'; });
    }

    // ──────────────────────────────────────────────────
    // 6. FAQ ACCORDION
    // ──────────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const parent = question.parentElement;
            const answer = question.nextElementSibling;

            // Close all other open items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                    const ans = item.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = null;
                }
            });

            parent.classList.toggle('active');
            if (answer) {
                answer.style.maxHeight = parent.classList.contains('active')
                    ? answer.scrollHeight + 'px'
                    : null;
            }
        });
    });

    

});  // end DOMContentLoaded


// ──────────────────────────────────────────────────
// COMMAND PALETTE LOGIC (with null-guard — safe on all pages)
// ──────────────────────────────────────────────────
const palette = document.getElementById('cmd-palette');
const cmdInput = document.getElementById('cmd-input');
const cmdItems = document.querySelectorAll('.cmd-item');
let activeIndex = -1;

function openPalette() {
    if (!palette) return;
    palette.style.display = 'flex';
    document.body.classList.add('palette-open');
    setTimeout(() => {
        palette.style.opacity = '1';
        const modal = palette.querySelector('.cmd-modal');
        if (modal) modal.style.transform = 'scale(1)';
        if (cmdInput) { cmdInput.focus(); cmdInput.value = ''; }
        filterItems('');
    }, 10);
}

function closePalette() {
    if (!palette) return;
    palette.style.opacity = '0';
    const modal = palette.querySelector('.cmd-modal');
    if (modal) modal.style.transform = 'scale(0.95)';
    document.body.classList.remove('palette-open');
    setTimeout(() => { palette.style.display = 'none'; }, 200);
}

function filterItems(query) {
    const q = query.toLowerCase();
    let visibleItems = [];
    cmdItems.forEach(item => {
        item.classList.remove('active');
        const text = item.textContent.toLowerCase();
        const keywords = item.getAttribute('data-keywords') || '';
        const show = !q || text.includes(q) || keywords.includes(q);
        item.style.display = show ? 'flex' : 'none';
        if (show) visibleItems.push(item);
    });
    activeIndex = -1;
    return visibleItems;
}

if (palette && cmdInput) {
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            palette.style.display === 'none' || palette.style.display === '' ? openPalette() : closePalette();
        }
        if (e.key === 'Escape' && palette.style.display !== 'none') closePalette();
    });

    palette.addEventListener('click', e => { if (e.target === palette) closePalette(); });
    cmdInput.addEventListener('input', e => filterItems(e.target.value));

    cmdInput.addEventListener('keydown', e => {
        const visible = Array.from(cmdItems).filter(i => i.style.display !== 'none');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % visible.length;
            visible.forEach(i => i.classList.remove('active'));
            if (visible[activeIndex]) { visible[activeIndex].classList.add('active'); visible[activeIndex].scrollIntoView({ block: 'nearest' }); }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = activeIndex - 1 < 0 ? visible.length - 1 : activeIndex - 1;
            visible.forEach(i => i.classList.remove('active'));
            if (visible[activeIndex]) { visible[activeIndex].classList.add('active'); visible[activeIndex].scrollIntoView({ block: 'nearest' }); }
        } else if (e.key === 'Enter') {
            const target = activeIndex >= 0 && visible[activeIndex] ? visible[activeIndex] : visible[0];
            if (target) { const href = target.getAttribute('href'); if (href) { target.getAttribute('target') === '_blank' ? window.open(href, '_blank') : window.location.href = href; } }
        }
    });
}

// ──────────────────────────────────────────────────
// AUDIO PLAYER LOGIC
// ──────────────────────────────────────────────────
const audio = document.getElementById('mudaber-audio');
const playBtn = document.getElementById('audio-play-btn');
const progressContainer = document.getElementById('audio-progress-container');
const progressBar = document.getElementById('audio-progress');
const currentTimeEl = document.getElementById('audio-current');
const durationEl = document.getElementById('audio-duration');
const albumArtWrap = document.getElementById('album-art-wrap');

if (audio && playBtn) {
    let isPlaying = false;

    const formatTime = t => isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<i class="bi bi-play-fill" style="margin-left:3px;"></i>';
            if (albumArtWrap) albumArtWrap.classList.remove('vinyl-spin');
            isPlaying = false;
        } else {
            audio.play()
                .then(() => {
                    playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                    if (albumArtWrap) albumArtWrap.classList.add('vinyl-spin');
                    isPlaying = true;
                })
                .catch(() => {
                    window.open('https://soundcloud.com/mudaber-music', '_blank');
                });
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (isNaN(audio.duration)) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => { if (durationEl) durationEl.textContent = formatTime(audio.duration); });

    if (progressContainer) {
        progressContainer.addEventListener('click', e => {
            if (!isNaN(audio.duration)) audio.currentTime = (e.offsetX / progressContainer.clientWidth) * audio.duration;
        });
    }

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.innerHTML = '<i class="bi bi-play-fill" style="margin-left:3px;"></i>';
        if (progressBar) progressBar.style.width = '0%';
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
        if (albumArtWrap) albumArtWrap.classList.remove('vinyl-spin');
    });
}

// ──────────────────────────────────────────────────
// PRELOADER + SCROLL PROGRESS BAR (global)
// ──────────────────────────────────────────────────
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloader-bar');
    if (preloader && bar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 35;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                bar.style.width = '100%';
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    setTimeout(() => preloader.remove(), 800);
                }, 350);
            } else {
                bar.style.width = progress + '%';
            }
        }, 120);
    }
});

// Scroll Progress Bar (inject once, skip if already in HTML)
(function () {
    let scrollBar = document.getElementById('scroll-progress');
    if (!scrollBar) {
        scrollBar = document.createElement('div');
        scrollBar.id = 'scroll-progress';
        scrollBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:#f5e642;z-index:10001;width:0%;box-shadow:0 0 8px rgba(245,230,66,0.6);transition:width 0.1s linear;pointer-events:none;';
        document.body.prepend(scrollBar);
    }
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
})();

// ──────────────────────────────────────────────────
// NEWSLETTER HANDLER (global — used in footer + CTA)
// ──────────────────────────────────────────────────
function handleNewsletter(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input || !btn) return;

    const email = input.value.trim();
    if (!email) return;

    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Subscribing...';
    btn.disabled = true;

    // Simulate API call (replace with real endpoint)
    setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Subscribed!';
        btn.style.background = '#7FD957';
        input.value = '';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 3500);
    }, 1200);
}

// ──────────────────────────────────────────────────
// ANIMATED STATS COUNTER
// ──────────────────────────────────────────────────
function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    if (isNaN(target)) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
    }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target], .g-stat-num[data-target]').forEach(el => counterObserver.observe(el));


// ===== THEME APPLIER =====
window.applyTheme = function(theme) {
    if (!theme) return;
    const r = document.documentElement.style;

    if (theme.bgColor)      r.setProperty('--c-bg',        theme.bgColor);
    if (theme.surfaceColor) r.setProperty('--c-surface',   theme.surfaceColor);
    if (theme.accentColor)  r.setProperty('--c-accent',    theme.accentColor);
    if (theme.textColor)    r.setProperty('--c-text',      theme.textColor);
    if (theme.mutedColor)   r.setProperty('--c-muted',     theme.mutedColor);
    if (theme.borderColor)  r.setProperty('--c-border',    theme.borderColor);
    if (theme.headerBg)     r.setProperty('--c-header-bg', theme.headerBg);
    if (theme.footerBg)     r.setProperty('--c-footer-bg', theme.footerBg);
    if (theme.btnColor)     r.setProperty('--c-btn',       theme.btnColor);
    if (theme.btnText)      r.setProperty('--c-btn-text',  theme.btnText);
    if (theme.linkColor)    r.setProperty('--c-link',      theme.linkColor);
    if (theme.baseFontSize) r.setProperty('--fs-base',     theme.baseFontSize);
    if (theme.lineHeight)   r.setProperty('--lh',          theme.lineHeight);

    // Load Google Fonts dynamically
    const displayFont = theme.displayFont || 'Space Grotesk';
    const bodyFont    = theme.bodyFont    || 'Inter';
    r.setProperty('--ff-display', `'${displayFont}', sans-serif`);
    r.setProperty('--ff-body',    `'${bodyFont}', sans-serif`);

    // Inject <link> for Google Fonts if not already present
    const fontId = 'dynamic-gfont';
    let fontLink = document.getElementById(fontId);
    if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id  = fontId;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }
    const families = [...new Set([displayFont, bodyFont])].map(f => f.replace(/ /g, '+')).join('&family=');
    fontLink.href = `https://fonts.googleapis.com/css2?family=${families}:wght@300;400;500;600;700&display=swap`;
};

// ===== BACKGROUND APPLIER =====
window.applyBackgrounds = function(backgrounds, pageName) {
    if (!backgrounds) return;

    // Apply per-page background to <body>
    const pageBg = backgrounds.pages && backgrounds.pages[pageName];
    if (pageBg) {
        _applyBgToEl(document.body, pageBg);
    }

    // Apply per-section backgrounds
    const sections = backgrounds.sections || {};
    Object.entries(sections).forEach(([sectionId, cfg]) => {
        const el = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (!el) return;
        _applyBgToEl(el, cfg);
    });
};

function _applyBgToEl(el, cfg) {
    if (!cfg || !cfg.type) return;
    el.style.position = 'relative';

    // Remove existing bg video if any
    const oldVid = el.querySelector('.section-bg-video');
    if (oldVid) oldVid.remove();
    const oldOverlay = el.querySelector('.section-bg-overlay');
    if (oldOverlay) oldOverlay.remove();

    switch (cfg.type) {
        case 'color':
            el.style.backgroundColor = cfg.value || '';
            el.style.backgroundImage = 'none';
            break;
        case 'image':
            el.style.backgroundImage   = `url('${cfg.value}')`;
            el.style.backgroundSize    = 'cover';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat  = 'no-repeat';
            _addOverlay(el, cfg.overlay || 0);
            break;
        case 'gradient':
            el.style.backgroundImage = cfg.value || '';
            break;
        case 'video':
            el.style.backgroundImage = 'none';
            const vid = document.createElement('video');
            vid.className  = 'section-bg-video';
            vid.src        = cfg.value;
            vid.autoplay   = true;
            vid.muted      = true;
            vid.loop       = true;
            vid.playsInline = true;
            vid.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;';
            el.insertBefore(vid, el.firstChild);
            _addOverlay(el, cfg.overlay || 0.5);
            // Make children above video
            Array.from(el.children).forEach(c => {
                if (!c.classList.contains('section-bg-video') && !c.classList.contains('section-bg-overlay')) {
                    c.style.position = 'relative';
                    c.style.zIndex   = '1';
                }
            });
            break;
    }
}

function _addOverlay(el, opacity) {
    if (!opacity || opacity <= 0) return;
    const ov = document.createElement('div');
    ov.className  = 'section-bg-overlay';
    ov.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,${opacity});z-index:0;pointer-events:none;`;
    el.insertBefore(ov, el.firstChild);
}

// ===== SECTION MANAGER =====
window.applySections = function(pageName, globalData) {

    if (!globalData || !globalData.sections || !globalData.sections[pageName]) return;
    const sections = globalData.sections[pageName];

    // Sort by order
    sections.sort((a, b) => a.order - b.order);

    // Apply visibility
    sections.forEach(sec => {
        const el = document.querySelector('[data-section-id="' + sec.id + '"]');
        if (!el) return;
        el.style.display = sec.visible ? '' : 'none';
    });

    // Safe DOM reordering: find common parent and reorder only section elements
    // We collect all section elements and reorder them in their parent
    const sectionEls = [];
    sections.forEach(sec => {
        const el = document.querySelector('[data-section-id="' + sec.id + '"]');
        if (el && sec.visible) sectionEls.push(el);
    });

    if (sectionEls.length > 1) {
        // Find the common parent (usually body)
        const parent = sectionEls[0].parentNode;
        // Check all have same parent
        const allSameParent = sectionEls.every(el => el.parentNode === parent);
        if (allSameParent && parent) {
            // Find the position of the first section in parent
            const firstSectionInParent = sectionEls[0];
            const firstIdx = Array.from(parent.children).indexOf(firstSectionInParent);
            // Insert sections in sorted order after the reference point
            // We use a reference node: the element just before the first section
            const referenceNode = firstSectionInParent.previousSibling;
            sectionEls.forEach(el => {
                // Reattach in sorted order (insertBefore next sibling of reference)
                if (referenceNode) {
                    parent.insertBefore(el, referenceNode.nextSibling);
                } else {
                    parent.appendChild(el);
                }
            });
        }
    }
};


// ===== DYNAMIC CONTENT RENDERER =====
window.renderDynamicContent = function(pageName, data) {
    if (!data) return;
    if (pageName === 'index') {
        const wfWrap = document.querySelector('.workflow-wrap');
        if (wfWrap && data.workflow) {
            wfWrap.innerHTML = '';
            data.workflow.forEach((wf, i) => {
                const delay = i + 1;
                const num = (i + 1).toString().padStart(2, '0');
                wfWrap.innerHTML += '<div class="workflow-item fade-up delay-' + delay + '">' +
                    '<div class="workflow-num">' + num + '</div>' +
                    '<div class="workflow-content">' +
                        '<h3>' + wf.title + '</h3>' +
                        '<p>' + wf.desc + '</p>' +
                    '</div>' +
                '</div>';
            });
        }
        const faqWrap = document.querySelector('.faq-wrap');
        if (faqWrap && data.faq) {
            faqWrap.innerHTML = '';
            data.faq.forEach((f, i) => {
                faqWrap.innerHTML += '<div class="faq-item fade-up delay-' + ((i%3)+1) + '">' +
                    '<button class="faq-question">' + f.q + ' <span class="faq-icon"><i class="bi bi-plus"></i></span></button>' +
                    '<div class="faq-answer"><div class="faq-answer-inner">' + f.a + '</div></div>' +
                '</div>';
            });
            document.querySelectorAll('.faq-question').forEach(q => {
                q.addEventListener('click', () => {
                    const ans = q.nextElementSibling;
                    const icon = q.querySelector('.faq-icon i');
                    const isOpen = ans.classList.contains('open');
                    document.querySelectorAll('.faq-answer').forEach(a => {
                        a.style.maxHeight = null;
                        a.classList.remove('open');
                    });
                    document.querySelectorAll('.faq-icon i').forEach(i => {
                        i.classList.remove('bi-dash');
                        i.classList.add('bi-plus');
                    });
                    if (!isOpen) {
                        ans.classList.add('open');
                        ans.style.maxHeight = ans.scrollHeight + "px";
                        icon.classList.remove('bi-plus');
                        icon.classList.add('bi-dash');
                    }
                });
            });
        }
        const tstWrap = document.querySelector('.testimonials-grid');
        if (tstWrap && data.testimonials) {
            tstWrap.innerHTML = '';
            data.testimonials.forEach((t, i) => {
                tstWrap.innerHTML += '<div class="testimonial-card fade-up delay-' + ((i%3)+1) + '">' +
                    '<div class="stars">\u2605\u2605\u2605\u2605\u2605</div>' +
                    '<p class="quote">&ldquo;' + t.quote + '&rdquo;</p>' +
                    '<div class="client-info">' +
                        '<div class="client-avatar">' + t.name.charAt(0) + '</div>' +
                        '<div>' +
                            '<div class="client-name">' + t.name + '</div>' +
                            '<div class="client-role">' + t.role + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            });
        }
    }
    if (pageName === 'about') {
        const valWrap = document.querySelector('.values-grid');
        if (valWrap && data.coreValues) {
            valWrap.innerHTML = '';
            data.coreValues.forEach((v, i) => {
                valWrap.innerHTML += '<div class="value-card fade-up delay-' + ((i%4)+1) + '">' +
                    '<i class="bi ' + v.icon + '"></i>' +
                    '<h3>' + v.title + '</h3>' +
                    '<p>' + v.desc + '</p>' +
                '</div>';
            });
        }
        const tlWrap = document.querySelector('.timeline');
        if (tlWrap && data.timeline) {
            tlWrap.innerHTML = '';
            data.timeline.forEach((t, i) => {
                tlWrap.innerHTML += '<div class="timeline-item fade-up delay-' + ((i%3)+1) + '">' +
                    '<div class="tl-year">' + t.year + '</div>' +
                    '<div class="tl-content">' +
                        '<h3>' + t.title + '</h3>' +
                        '<p>' + t.desc + '</p>' +
                    '</div>' +
                '</div>';
            });
        }
    }
    if (pageName === 'ecosystem') {
        const pltWrap = document.querySelector('.platforms-container');
        if (pltWrap && data.platforms) {
            pltWrap.innerHTML = '';
            data.platforms.forEach((p, i) => {
                const featuresHtml = p.features.split(',').map(f => '<span class="platform-tag">' + f.trim() + '</span>').join('');
                pltWrap.innerHTML += '<div class="platform-row fade-up">' +
                    '<div class="platform-text">' +
                        '<div class="platform-icon" style="color: ' + p.color + '"><i class="bi ' + p.icon + '"></i></div>' +
                        '<h2>' + p.title + '</h2>' +
                        '<p>' + p.desc + '</p>' +
                        '<div class="platform-tags">' +
                            featuresHtml +
                        '</div>' +
                        '<a href="#" class="btn-outline-mudaber mt-4">Visit Platform <i class="bi bi-box-arrow-up-right"></i></a>' +
                    '</div>' +
                '</div>';
            });
        }
    }
    if (pageName === 'careers') {
        const prkWrap = document.querySelector('.perks-grid');
        if (prkWrap && data.perks) {
            prkWrap.innerHTML = '';
            data.perks.forEach((p, i) => {
                prkWrap.innerHTML += '<div class="value-card fade-up delay-' + ((i%4)+1) + '">' +
                    '<div class="value-icon"><i class="bi ' + p.icon + '"></i></div>' +
                    '<h3 style="color: var(--c-white); font-size: 1.2rem; margin-bottom: 0.5rem;">' + p.title + '</h3>' +
                    '<p class="text-muted-custom">' + p.desc + '</p>' +
                '</div>';
            });
        }
        const jobWrap = document.querySelector('.jobs-list');
        if (jobWrap && data.jobs) {
            jobWrap.innerHTML = '';
            data.jobs.forEach((j, i) => {
                jobWrap.innerHTML += '<div class="job-card fade-up delay-' + ((i%3)+1) + '">' +
                    '<div class="job-info">' +
                        '<h3>' + j.title + '</h3>' +
                        '<div class="job-meta">' +
                            '<span class="job-dept">' + j.dept + '</span>' +
                            '<span><i class="bi bi-geo-alt"></i> ' + j.type + '</span>' +
                        '</div>' +
                        '<p style="color: var(--c-muted); margin-top: 10px; font-size: 0.95rem;">' + j.desc + '</p>' +
                    '</div>' +
                    '<div class="job-action">' +
                        '<a href="contact.html" class="btn-outline-mudaber">Apply Now <i class="bi bi-arrow-right"></i></a>' +
                    '</div>' +
                '</div>';
            });
        }
    }
    if (pageName === 'contact') {
        const titleEl = document.getElementById('contact-info-title');
        const descEl = document.getElementById('contact-info-desc');
        const emailEl = document.getElementById('contact-info-email');
        if (titleEl) titleEl.textContent = data.infoTitle;
        if (descEl) descEl.textContent = data.infoDesc;
        if (emailEl) {
            emailEl.textContent = data.email;
            emailEl.href = "mailto:" + data.email;
        }
    }
};

