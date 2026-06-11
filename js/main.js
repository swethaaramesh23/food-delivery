/* ==========================================================================
   Stackly - Main Landing Page Script File
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. Preloader (Strict 2.5s) & GSAP Entrance Animations & Global Image Optimization
    // ==========================================================================
    const preloader = document.getElementById("preloader");
    
    // Global Image Optimization: Add lazy loading, skeletons, and fallbacks dynamically
    document.querySelectorAll("img").forEach(img => {
        // Skip hero and logo images from optimization
        if (img.classList.contains("hero-main-img") || img.classList.contains("logo-img")) return;
        
        img.setAttribute("loading", "lazy");
        img.classList.add("skeleton-img");
        
        // Add skeleton wrapper if not already wrapped
        if (!img.parentElement.classList.contains("skeleton-wrapper")) {
            const wrapper = document.createElement("div");
            wrapper.className = "skeleton-wrapper";
            wrapper.style.position = "relative";
            wrapper.style.width = "100%";
            wrapper.style.height = "100%";
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            const skeleton = document.createElement("div");
            skeleton.className = "skeleton";
            wrapper.appendChild(skeleton);
            
            // Remove skeleton when loaded
            img.onload = () => {
                skeleton.remove();
                img.classList.add("loaded");
            };
        }
        
        img.onerror = function() {
            this.onerror = null;
            this.src = "image/fallback.webp";
            // Also remove skeleton on error so fallback is visible
            const skel = this.parentElement.querySelector(".skeleton");
            if (skel) skel.remove();
            this.classList.add("loaded");
        };
        
        // Trigger load event if image is already cached
        if (img.complete) {
            img.onload();
        }
    });
    
    setTimeout(() => {
        // Fade out preloader
        if (preloader) {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        }
        
        // Trigger GSAP entrance animations for Hero Section
        if (typeof gsap !== "undefined") {
            gsap.from(".hero-main-img", {
                duration: 1.5,
                x: 100,
                opacity: 0,
                rotate: 15,
                ease: "power4.out"
            });
            
            gsap.from(".hero-content > *", {
                duration: 1.2,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: "power3.out"
            });
            
            gsap.from(".floating-food", {
                duration: 2.0,
                scale: 0,
                opacity: 0,
                stagger: 0.15,
                ease: "back.out(1.7)"
            });
        }
    }, 2500);

    // ==========================================================================
    // 2. Global Scroll progress & Sticky Header
    // ==========================================================================
    const scrollProgress = document.getElementById("scroll-progress");
    const header = document.getElementById("header");
    const scrollToTop = document.getElementById("scroll-to-top");
    
    window.addEventListener("scroll", () => {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledVal = (window.scrollY / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrolledVal + "%";
        }
        
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
        
        if (scrollToTop) {
            if (window.scrollY > 500) {
                scrollToTop.classList.add("visible");
            } else {
                scrollToTop.classList.remove("visible");
            }
        }
    });

    if (scrollToTop) {
        scrollToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================================================
    // 3. Mobile Navigation Toggle Menu Drawer
    // ==========================================================================
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    
    if (navToggle && navMenu) {
        // Create nav overlay dynamically
        let navOverlay = document.getElementById("nav-overlay");
        if (!navOverlay) {
            navOverlay = document.createElement("div");
            navOverlay.className = "nav-overlay";
            navOverlay.id = "nav-overlay";
            document.body.appendChild(navOverlay);
        }

        function toggleNav() {
            navMenu.classList.toggle("open");
            navOverlay.classList.toggle("open");
            const spans = navToggle.querySelectorAll("span");
            if (navMenu.classList.contains("open")) {
                document.body.style.overflow = "hidden"; // Disable scroll
                spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
            } else {
                document.body.style.overflow = ""; // Enable scroll
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        }

                navToggle.addEventListener("click", toggleNav);
        navOverlay.addEventListener("click", toggleNav);

        // Close menu on link click
        const navLinks = navMenu.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navMenu.classList.contains("open")) {
                    toggleNav();
                }
            });
        });
    }

    // ==========================================================================
    // 4. Search Overlay Panel triggers
    // ==========================================================================
    const searchTrigger = document.getElementById("search-trigger");
    const closeSearch = document.getElementById("close-search");
    const searchOverlay = document.getElementById("search-overlay");
    const searchInput = document.getElementById("search-input");
    
    if (searchTrigger && searchOverlay) {
        searchTrigger.addEventListener("click", () => {
            searchOverlay.classList.add("open");
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 100);
        });
    }
    
    if (closeSearch && searchOverlay) {
        closeSearch.addEventListener("click", () => {
            searchOverlay.classList.remove("open");
        });
        
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && searchOverlay.classList.contains("open")) {
                searchOverlay.classList.remove("open");
            }
        });
    }

    // ==========================================================================
    // 5. Shopping Cart State Manager (Stackly)
    // ==========================================================================
    const cartTrigger = document.getElementById("cart-trigger");
    const closeCart = document.getElementById("close-cart");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartOverlay = document.getElementById("cart-overlay");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    
    const cartBadgeCount = document.getElementById("cart-badge-count");
    const cartItemsList = document.getElementById("cart-items-list");
    const cartSubtotalVal = document.getElementById("cart-subtotal-val");
    
    let cart = []; try { cart = JSON.parse(localStorage.getItem("stackly_cart")) || []; } catch(e) { cart = []; }
    
    function saveCart() {
        localStorage.setItem("stackly_cart", JSON.stringify(cart));
        updateCartUI();
    }
    
    function updateCartUI() {
        if (!cartItemsList) return;
        
        const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartBadgeCount) {
            cartBadgeCount.innerText = totalItemsCount;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (cartSubtotalVal) {
            cartSubtotalVal.innerText = `$${subtotal.toFixed(2)}`;
        }
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="cart-empty-msg">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Your basket is empty.<br>Start adding delicious food!</p>
                </div>
            `;
        } else {
            cartItemsList.innerHTML = "";
            cart.forEach(item => {
                const itemHTML = `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-qty">
                                <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <span class="qty-val">${item.qty}</span>
                                <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="remove-cart-item" data-id="${item.id}" aria-label="Remove item">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                `;
                cartItemsList.insertAdjacentHTML("beforeend", itemHTML);
            });
            
            bindCartItemActionListeners();
        }
    }
    
    function bindCartItemActionListeners() {
        document.querySelectorAll(".qty-plus").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const item = cart.find(x => x.id === id);
                if (item) {
                    item.qty += 1;
                    saveCart();
                }
            });
        });
        
        document.querySelectorAll(".qty-minus").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const item = cart.find(x => x.id === id);
                if (item) {
                    item.qty -= 1;
                    if (item.qty <= 0) {
                        cart = cart.filter(x => x.id !== id);
                    }
                    saveCart();
                }
            });
        });
        
        document.querySelectorAll(".remove-cart-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                cart = cart.filter(x => x.id !== id);
                saveCart();
                showToast("Item removed from basket", "error");
            });
        });
    }

    if (cartTrigger && cartDrawer && cartOverlay) {
        cartTrigger.addEventListener("click", () => {
            cartDrawer.classList.add("open");
            cartOverlay.classList.add("open");
        });
    }
    
    if (closeCart && cartDrawer && cartOverlay) {
        closeCart.addEventListener("click", () => {
            cartDrawer.classList.remove("open");
            cartOverlay.classList.remove("open");
        });
        
        cartOverlay.addEventListener("click", () => {
            cartDrawer.classList.remove("open");
            cartOverlay.classList.remove("open");
        });
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            if (cart.length > 0) {
                cart = [];
                saveCart();
                showToast("Basket cleared completely", "error");
            }
        });
    }
    
    // Bind Add to Cart Menu buttons
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const name = btn.getAttribute("data-name");
            const price = parseFloat(btn.getAttribute("data-price"));
            const img = btn.getAttribute("data-img");
            
            const existingItem = cart.find(x => x.id === id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id, name, price, img, qty: 1 });
            }
            
            saveCart();
            showToast(`${name} added to basket!`, "success");
            
            // Add to Cart Animation
            const imgEl = btn.closest('.menu-card') ? btn.closest('.menu-card').querySelector('img') : null;
            if (cartTrigger && imgEl) {
                cartTrigger.style.transform = "scale(1.3)";
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
                btn.style.backgroundColor = '#16a34a';
                btn.style.color = 'white';
                setTimeout(() => {
                    cartTrigger.style.transform = "scale(1)";
                    btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add';
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 1500);
            }
        });
    });
    
    saveCart();

    // ==========================================================================
    // 6. Custom Toast Alerts System
    // ==========================================================================
    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast-msg toast-${type}`;
        
        const icon = type === "success" 
            ? '<i class="fa-solid fa-circle-check"></i>' 
            : '<i class="fa-solid fa-triangle-exclamation"></i>';
            
        toast.innerHTML = `${icon} <span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add("show");
        }, 50);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }

    // ==========================================================================
    // 7. Stats Counter Animation (Intersection Observer)
    // ==========================================================================
    const counterElements = document.querySelectorAll(".stat-num");
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute("data-target"), 10);
                let current = 0;
                const duration = 2000; 
                const stepTime = Math.max(Math.floor(duration / limit), 15);
                
                const timer = setInterval(() => {
                    if (limit > 1000) {
                        current += Math.ceil(limit / 50);
                    } else if (limit > 100) {
                        current += Math.ceil(limit / 30);
                    } else {
                        current += 1;
                    }
                    
                    if (current >= limit) {
                        current = limit;
                        clearInterval(timer);
                    }
                    
                    if (limit === 10000) {
                        target.innerText = (current / 1000).toFixed(0) + "K+";
                    } else if (limit === 24) {
                        target.innerText = current + "/7";
                    } else {
                        target.innerText = current + "+";
                    }
                }, stepTime);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.1 });
    
    counterElements.forEach(el => statsObserver.observe(el));

    // ==========================================================================
    // 8. Offers Countdown Clock Timer
    // ==========================================================================
    const clockContainers = document.querySelectorAll(".countdown-clock");
    
    clockContainers.forEach(clockContainer => {
        const endTimeStr = clockContainer.getAttribute("data-end");
        let endTime = new Date(endTimeStr).getTime();
        const now = new Date().getTime();
        
        if (endTime < now || isNaN(endTime)) {
            endTime = now + (15 * 24 * 60 * 60 * 1000); 
        }
        
        const daysVal = clockContainer.querySelector(".timer-days") || document.getElementById("timer-days");
        const hoursVal = clockContainer.querySelector(".timer-hours") || document.getElementById("timer-hours");
        const minsVal = clockContainer.querySelector(".timer-mins") || document.getElementById("timer-mins");
        const secsVal = clockContainer.querySelector(".timer-secs") || document.getElementById("timer-secs");
        
        const countdownTimer = setInterval(() => {
            const currentNow = new Date().getTime();
            const difference = endTime - currentNow;
            
            if (difference < 0) {
                clearInterval(countdownTimer);
                clockContainer.innerHTML = "<div class='offer-tag' style='color:#FF3B30;'>Offer Expired!</div>";
                return;
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            if (daysVal) daysVal.innerText = days.toString().padStart(2, "0");
            if (hoursVal) hoursVal.innerText = hours.toString().padStart(2, "0");
            if (minsVal) minsVal.innerText = minutes.toString().padStart(2, "0");
            if (secsVal) secsVal.innerText = seconds.toString().padStart(2, "0");
            
        }, 1000);
    });

    // ==========================================================================
    // 9. Customer Testimonials Slider Auto-carousel
    // ==========================================================================
    const testiTrack = document.getElementById("testimonial-track");
    const testiDots = document.querySelectorAll(".testi-dot");
    let activeTestiIndex = 0;
    let testiAutoPlayInterval;
    
    function showTestiSlide(index) {
        if (!testiTrack) return;
        activeTestiIndex = index;
        testiTrack.style.transform = `translateX(-${index * 100}%)`;
        
        testiDots.forEach(dot => {
            const idx = parseInt(dot.getAttribute("data-index"), 10);
            if (idx === index) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }
    
    testiDots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-index"), 10);
            showTestiSlide(index);
            resetTestiAutoplay();
        });
    });
    
    function startTestiAutoplay() {
        if (!testiTrack) return;
        testiAutoPlayInterval = setInterval(() => {
            let nextIndex = activeTestiIndex + 1;
            if (nextIndex >= testiDots.length) {
                nextIndex = 0;
            }
            showTestiSlide(nextIndex);
        }, 5000);
    }
    
    function resetTestiAutoplay() {
        clearInterval(testiAutoPlayInterval);
        startTestiAutoplay();
    }
    
    startTestiAutoplay();

    // ==========================================================================
    // 10. Gallery Lightbox Viewer Modal
    // ==========================================================================
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.getElementById("close-lightbox");
    
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const src = item.getAttribute("data-src");
            if (lightbox && lightboxImg && src) {
                lightboxImg.setAttribute("src", src);
                lightbox.classList.add("open");
            }
        });
    });
    
    if (lightbox && closeLightbox) {
        closeLightbox.addEventListener("click", () => {
            lightbox.classList.remove("open");
        });
        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove("open");
            }
        });
    }

    // ==========================================================================
    // 11. Contact & Newsletter Forms Submission Mock
    // ==========================================================================
    const contactForm = document.getElementById("contact-form");
    const contactSubmitBtn = document.getElementById("contact-submit-btn");
    
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (contactSubmitBtn) {
                contactSubmitBtn.disabled = true;
                contactSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            }
            
            setTimeout(() => {
                showToast("Thank you! Your message was sent successfully.", "success");
                contactForm.reset();
                if (contactSubmitBtn) {
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                }
            }, 1500);
        });
    }
    
    const newsletterForm = document.getElementById("newsletter-form");
    const newsletterBtn = document.getElementById("newsletter-btn");
    
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (newsletterBtn) {
                newsletterBtn.disabled = true;
                newsletterBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            }
            
            setTimeout(() => {
                showToast("Awesome! You have subscribed to our newsletter.", "success");
                newsletterForm.reset();
                if (newsletterBtn) {
                    newsletterBtn.disabled = false;
                    newsletterBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Subscribe';
                }
            }, 1500);
        });
    }

    // ==========================================================================
    // 12. Custom Scroll Reveal (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.15 });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // ==========================================================================
    // 13. Dynamic Auth Validation (Login & Signup)
    // ==========================================================================
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            if (!email.includes("@")) { showToast("Please enter a valid email", "error"); return; }
            if (password.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
            showToast("Login successful!", "success");
            setTimeout(() => { window.location.href = "customer-dashboard.html"; }, 1000);
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirm = document.getElementById("confirm-password") ? document.getElementById("confirm-password").value : "";
            if (!email.includes("@")) { showToast("Please enter a valid email", "error"); return; }
            if (password.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
            if (password !== confirm) { showToast("Passwords do not match!", "error"); return; }
            showToast("Account created successfully!", "success");
            setTimeout(() => { window.location.href = "login.html"; }, 1500);
        });
    }

    // Toggle Password Visibility
    document.querySelectorAll(".toggle-password").forEach(toggle => {
        toggle.addEventListener("click", function () {
            const input = this.parentElement.querySelector("input");
            if (input.type === "password") {
                input.type = "text";
                this.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                this.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    // ==========================================================================
    // 14. Dynamic Food Card Enhancements (Badges & Delivery Time)
    // ==========================================================================
    document.querySelectorAll(".menu-card").forEach((card, index) => {
        // Add Delivery Time
        const priceContainer = card.querySelector(".menu-price");
        if (priceContainer && !priceContainer.parentElement.querySelector(".delivery-time")) {
            const deliveryHtml = `<div class="delivery-time"><i class="fa-regular fa-clock"></i> ${20 + (index % 3) * 5} mins</div>`;
            priceContainer.insertAdjacentHTML("afterend", deliveryHtml);
        }
        
        // Add Discount Badge dynamically if not exists (simulate offers)
        if (index % 4 === 0 && !card.querySelector(".badge-discount")) {
            const badgeHtml = `<div class="food-badge badge-discount" style="background:#FF3B30; color:white; top:15px; right:15px; left:auto;">20% OFF</div>`;
            const imgBox = card.querySelector(".menu-img-box");
            if (imgBox) imgBox.insertAdjacentHTML("afterbegin", badgeHtml);
        }
    });

});




    // Dynamic Footer Year
    document.querySelectorAll('.current-year').forEach(el => { el.innerText = new Date().getFullYear(); });
