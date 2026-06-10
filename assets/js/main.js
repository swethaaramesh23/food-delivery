document.addEventListener("DOMContentLoaded", () => {
    // Preloader handling – wait for fonts and then hide
    const preloader = document.getElementById("preloader");
    const hidePreloader = () => {
        if (!preloader) return;
        preloader.classList.add("fade-out");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 600);
    };
// Simple preloader hide after timeout
setTimeout(hidePreloader, 1500);

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // ==========================================================================
    // 1. HERO: Typewriter Effect
    // ==========================================================================
    const typewriterEl = document.getElementById('typewriter-title');
    if (typewriterEl) {
        const phrases = ['a Better Tomorrow', 'Sustainable Growth', 'Higher Yields', 'a Greener Planet'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const baseText = 'Smart Farming for ';

        // Add cursor span
        let cursorSpan = typewriterEl.querySelector('.typewriter-cursor');
        if (!cursorSpan) {
            cursorSpan = document.createElement('span');
            cursorSpan.className = 'typewriter-cursor';
            typewriterEl.appendChild(cursorSpan);
        }

        function typeWrite() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            // Update text content (keep cursor at end)
            typewriterEl.innerHTML = baseText +
                '<span style="color: var(--accent-color);">' +
                currentPhrase.substring(0, charIndex) +
                '</span><span class="typewriter-cursor"></span>';

            let delay = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                delay = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
            }

            setTimeout(typeWrite, delay);
        }

        // Start typewriter after preloader
        setTimeout(typeWrite, 2200);
    }

    // ==========================================================================
    // 1. HERO: Floating Leaves
    // ==========================================================================
    const leavesContainer = document.querySelector('.leaves-container');
    if (leavesContainer) {
        const leafEmojis = ['🍃', '🌿', '☘️', '🍀', '🌱'];
        function createLeaf() {
            const leaf = document.createElement('span');
            leaf.className = 'floating-leaf';
            leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
            leaf.style.animationDuration = (8 + Math.random() * 8) + 's';
            leaf.style.animationDelay = Math.random() * 3 + 's';
            leavesContainer.appendChild(leaf);

            // Remove leaf after animation completes
            setTimeout(() => {
                if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
            }, 20000);
        }

        // Create leaves periodically
        setInterval(createLeaf, 2500);
        // Initial burst
        for (let i = 0; i < 5; i++) {
            setTimeout(createLeaf, i * 600);
        }
    }

    // ==========================================================================
    // 1. HERO: Image Carousel with zoom
    // ==========================================================================
    const heroImages = document.querySelectorAll('.hero-img.hero-slide');
    let currentHeroIndex = 0;
    if (heroImages.length > 0) {
        const totalImages = heroImages.length;
        function showNextImage() {
            heroImages[currentHeroIndex].classList.remove('active');
            currentHeroIndex = (currentHeroIndex + 1) % totalImages;
            heroImages[currentHeroIndex].classList.add('active');
        }
        heroImages.forEach((img, idx) => {
            if (idx === 0) img.classList.add('active');
            else img.classList.remove('active');
        });
        setInterval(showNextImage, 5000);
    }

    // ==========================================================================
    // 2. Running Counters / Milestones Animation
    // ==========================================================================
    const animateCounters = (selector, targetAttr) => {
        const counters = document.querySelectorAll(selector);
        counters.forEach(counter => {
            const target = +counter.getAttribute(targetAttr);
            const suffix = counter.getAttribute('data-suffix') || '';
            const divisor = +counter.getAttribute('data-divisor') || 1;

            const duration = 2000;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeProgress * target);

                const displayVal = divisor > 1 ? (currentCount / divisor) : currentCount;
                counter.innerText = displayVal + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    const finalVal = divisor > 1 ? (target / divisor) : target;
                    counter.innerText = finalVal + suffix;
                }
            };
            requestAnimationFrame(updateCount);
        });
    };

    // Stats section counter
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters('.counter', 'data-target');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(statsSection);
    }

    // Milestones counter
    const milestonesSection = document.querySelector('.about-milestones');
    if (milestonesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters('.milestone-num', 'data-count');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(milestonesSection);
    }

    // Stats banner counter
    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) {
        const bannerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters('.stat-number', 'data-target');
                    bannerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        bannerObserver.observe(statsBanner);
    }

    // ==========================================================================
    // 3. Scroll-Triggered Animations for [data-animate]
    // ==========================================================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (window.innerWidth > 768 && 'IntersectionObserver' in window) {
        document.body.classList.add('animations-active');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // ==========================================================================
    // 4. Section Visibility Observers (Why Choose Us, Weather, How It Works)
    // ==========================================================================
    const sectionVisibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionVisibilityObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Why Choose Us
    const whySection = document.querySelector('.why-choose-us');
    if (whySection) sectionVisibilityObserver.observe(whySection);

    // Weather & Market
    const weatherSection = document.querySelector('.weather-market');
    if (weatherSection) sectionVisibilityObserver.observe(weatherSection);

    // How It Works
    const howSection = document.querySelector('#how-it-works');
    if (howSection) sectionVisibilityObserver.observe(howSection);

    // ==========================================================================
    // 5. FAQ Accordion
    // ==========================================================================
    const faqSection = document.querySelector('#faq');
    if (faqSection) {
        // Visibility observer
        const faqObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    faqSection.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        faqObserver.observe(faqSection);

        // Toggle open/close
        const faqItems = faqSection.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                faqItems.forEach(i => i.classList.remove('open'));
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    // ==========================================================================
    // 6. Testimonials Auto-Slider (every 5 seconds)
    // ==========================================================================
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        const dots = testimonialSlider.parentElement.querySelectorAll('.testimonial-dot');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        // Initialize
        showSlide(0);
        slideInterval = setInterval(nextSlide, 5000);

        // Dot click handlers
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(idx);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }

    // ==========================================================================
    // 7. Back-to-Top Button
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // 8. Innovation Section Animations
    // ==========================================================================
    const innovationSection = document.querySelector('#innovation');
    if (innovationSection) {
        const innovObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    innovationSection.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        innovObserver.observe(innovationSection);
    }

});
