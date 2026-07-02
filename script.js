document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navIcon = document.getElementById('navIcon');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (navToggle && mobileMenu && navIcon) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            if (mobileMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                navIcon.classList.remove('bi-list');
                navIcon.classList.add('bi-x-lg');
            } else {
                document.body.style.overflow = ''; // Restore scrolling
                navIcon.classList.remove('bi-x-lg');
                navIcon.classList.add('bi-list');
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
                navIcon.classList.remove('bi-x-lg');
                navIcon.classList.add('bi-list');
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
    const fadeElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
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

    fadeElements.forEach(el => revealObserver.observe(el));

    // 4. Custom Cursor Logic
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    
    // Only run cursor logic if the elements exist and we're not on mobile/touch
    if (cursor && cursorDot && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smoother cursor performance
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                
                // Add slight delay to the outer cursor for a "following" effect
                setTimeout(() => {
                    cursorDot.style.left = `${e.clientX}px`;
                    cursorDot.style.top = `${e.clientY}px`;
                }, 40);
            });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .eco-card, .workflow-item, .faq-question, .news-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
            cursorDot.style.display = 'none';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.display = 'block';
            cursorDot.style.display = 'block';
        });
    }

    // 5. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parent = question.parentElement;
            const answer = question.nextElementSibling;
            
            // Close other open FAQs
            const activeItems = document.querySelectorAll('.faq-item.active');
            activeItems.forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            // Toggle current FAQ
            parent.classList.toggle('active');
            
            if (parent.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
});


// COMMAND PALETTE LOGIC
const palette = document.getElementById('cmd-palette');
const cmdInput = document.getElementById('cmd-input');
const cmdItems = document.querySelectorAll('.cmd-item');
let activeIndex = -1;

function openPalette() {
    palette.style.display = 'flex';
    document.body.classList.add('palette-open');
    setTimeout(() => {
        palette.style.opacity = '1';
        palette.querySelector('.cmd-modal').style.transform = 'scale(1)';
        cmdInput.focus();
        cmdInput.value = '';
        filterItems('');
    }, 10);
}

function closePalette() {
    palette.style.opacity = '0';
    palette.querySelector('.cmd-modal').style.transform = 'scale(0.95)';
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
        if (text.includes(q) || keywords.includes(q)) {
            item.style.display = 'flex';
            visibleItems.push(item);
        } else {
            item.style.display = 'none';
        }
    });
    activeIndex = -1;
    return visibleItems;
}

if(palette && cmdInput) {
    // Keyboard shortcut (Cmd+K / Ctrl+K)
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (palette.style.display === 'none' || palette.style.display === '') openPalette();
            else closePalette();
        }
        if (e.key === 'Escape' && palette.style.display !== 'none') closePalette();
    });

    // Close on click outside
    palette.addEventListener('click', e => {
        if(e.target === palette) closePalette();
    });

    // Filtering
    cmdInput.addEventListener('input', e => filterItems(e.target.value));

    // Keyboard navigation
    cmdInput.addEventListener('keydown', e => {
        const visible = Array.from(cmdItems).filter(i => i.style.display !== 'none');
        if(e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % visible.length;
            visible.forEach(i => i.classList.remove('active'));
            if(visible[activeIndex]) {
                visible[activeIndex].classList.add('active');
                visible[activeIndex].scrollIntoView({block: 'nearest'});
            }
        } else if(e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = activeIndex - 1 < 0 ? visible.length - 1 : activeIndex - 1;
            visible.forEach(i => i.classList.remove('active'));
            if(visible[activeIndex]) {
                visible[activeIndex].classList.add('active');
                visible[activeIndex].scrollIntoView({block: 'nearest'});
            }
        } else if(e.key === 'Enter') {
            if(activeIndex >= 0 && visible[activeIndex]) {
                window.location.href = visible[activeIndex].getAttribute('href');
            } else if(visible.length > 0) {
                window.location.href = visible[0].getAttribute('href');
            }
        }
    });
}



// CUSTOM AUDIO PLAYER LOGIC
const audio = document.getElementById('mudaber-audio');
const playBtn = document.getElementById('audio-play-btn');
const progressContainer = document.getElementById('audio-progress-container');
const progressBar = document.getElementById('audio-progress');
const currentTimeEl = document.getElementById('audio-current');
const durationEl = document.getElementById('audio-duration');

if(audio && playBtn) {
    let isPlaying = false;

    // Play / Pause
    playBtn.addEventListener('click', () => {
        if(isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<i class="bi bi-play-fill" style="margin-left: 3px;"></i>';
        } else {
            audio.play();
            playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        }
        isPlaying = !isPlaying;
    });

    // Format Time
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // Update Progress
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // Set Duration once loaded
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    // Click on progress bar to seek
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });
    
    // Auto-reset when ended
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.innerHTML = '<i class="bi bi-play-fill" style="margin-left: 3px;"></i>';
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });
}

// ==========================================
// PRELOADER & SCROLL PROGRESS (GLOBAL)
// ==========================================

window.addEventListener('load', () => {
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloader-bar');
    if (preloader && bar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            bar.style.width = progress + '%';
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    setTimeout(() => preloader.remove(), 800);
                }, 400);
            }
        }, 150);
    }
});

// Scroll Progress Bar
(function() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:#f5e642;z-index:10000;width:0%;box-shadow:0 0 10px rgba(245,230,66,0.5);transition:width 0.1s;';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    });
})();
