/* =========================================
   1. PRELOADER — 2 second minimum display
   ========================================= */
const preloader = document.getElementById('preloader');

if (preloader) {
    const minDisplayTime = 2000; // 2 seconds
    const start = Date.now();

    window.addEventListener('load', () => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, minDisplayTime - elapsed);

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initAOS();
            }, 600);
        }, remaining);
    });
}

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, offset: 80, once: true });
    }
}

/* =========================================
   2. MOBILE MENU & STICKY HEADER
   ========================================= */
const navMenu   = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose  = document.getElementById('nav-close');
const header    = document.getElementById('header');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Close menu when a nav-link is clicked (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// Sticky Header
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scroll-header', window.scrollY >= 50);
    });
}

/* =========================================
   3. ACTIVE NAV LINK BASED ON URL
   ========================================= */
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    // Highlight exact page matches; ignore anchor links for hash sections
    if (href && !href.startsWith('#') && !href.includes('#') && href === currentFile) {
        link.classList.add('active');
    } else if (href && !href.startsWith('#') && !href.includes('#') && href !== currentFile) {
        link.classList.remove('active');
    }
});

/* =========================================
   4. SHOPPING CART
   ========================================= */
let cart = JSON.parse(localStorage.getItem('foodiesCart') || '[]');

const cartBtn     = document.getElementById('cartBtn');
const cartModal   = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart   = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

function saveCart() {
    localStorage.setItem('foodiesCart', JSON.stringify(cart));
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('#cartCount, .cart-badge').forEach(el => {
        el.textContent = total;
    });
}

function renderCart() {
    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart-msg">Your cart is empty. Add some delicious items!</p>';
        if (cartTotalEl) cartTotalEl.textContent = '0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        html += `
            <div class="cart-item">
                <div class="cart-item-name">${item.name} <small>x${item.qty}</small></div>
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                <button class="cart-item-remove" data-idx="${idx}" title="Remove item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>`;
    });

    cartItemsEl.innerHTML = html;
    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);

    // Remove item listeners
    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.idx);
            cart.splice(i, 1);
            saveCart();
            updateCartCount();
            renderCart();
        });
    });
}

function openCartModal() {
    if (!cartModal) return;
    renderCart();
    cartModal.classList.add('open');
    cartModal.style.display = 'flex';
    if (cartOverlay) {
        cartOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCartModal() {
    if (!cartModal) return;
    cartModal.classList.remove('open');
    setTimeout(() => { cartModal.style.display = 'none'; }, 350);
    if (cartOverlay) {
        cartOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

if (cartBtn)     cartBtn.addEventListener('click', openCartModal);
if (closeCart)   closeCart.addEventListener('click', closeCartModal);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartModal);

// Add-to-cart buttons (on menu/offers pages)
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const name  = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const existing = cart.find(i => i.name === name);

        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        saveCart();
        updateCartCount();

        // Visual feedback
        btn.style.background = '#28a745';
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.style.background = '';
            btn.innerHTML = '<i class="fas fa-plus"></i>';
        }, 800);
    });
});

// Initialise cart count on page load
updateCartCount();

/* =========================================
   5. COUNTER ANIMATION
   ========================================= */
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const inc = Math.ceil(target / speed);

        const tick = () => {
            count = Math.min(count + inc, target);
            counter.innerText = count + (target > 100 ? '+' : '');
            if (count < target) setTimeout(tick, 10);
        };
        tick();
    });
};

const statsSection = document.getElementById('stats');
if (statsSection) {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect();
        }
    }, { threshold: 0.4 });
    observer.observe(statsSection);
}

/* =========================================
   6. FAQ ACCORDION
   ========================================= */
document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            const active = document.querySelector('.faq-item.active');
            if (active && active !== item) active.classList.remove('active');
            item.classList.toggle('active');
        });
    }
});

/* =========================================
   7. MENU FILTER TABS
   ========================================= */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

/* =========================================
   8. CLOSE MOBILE MENU ON OUTSIDE CLICK
   ========================================= */
document.addEventListener('click', e => {
    if (navMenu && navMenu.classList.contains('show-menu')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu');
        }
    }
});
