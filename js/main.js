/**
 * Slingking — Main interactions
 */

(function () {
  /* Homepage splash screen */
  const SPLASH_STORAGE_KEY = 'slingking-splash-seen';
  const splashScreen = document.getElementById('splash-screen');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function endSplash() {
    if (!splashScreen) return;
    document.body.classList.remove('splash-pending');
    splashScreen.classList.add('is-exiting');
    splashScreen.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem(SPLASH_STORAGE_KEY, '1');
    window.setTimeout(() => {
      splashScreen.classList.add('is-skipped');
    }, 700);
  }

  if (splashScreen) {
    const forceSplash = new URLSearchParams(window.location.search).has('splash');
    const alreadySeen = !forceSplash && sessionStorage.getItem(SPLASH_STORAGE_KEY);

    if (alreadySeen) {
      splashScreen.classList.add('is-skipped');
      document.body.classList.remove('splash-pending');
    } else if (reducedMotion) {
      splashScreen.classList.add('is-reduced');
      window.setTimeout(endSplash, 900);
    } else {
      window.setTimeout(endSplash, 2900);
      splashScreen.addEventListener('click', endSplash, { once: true });
    }
  }

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navOverlay = document.querySelector('.nav-overlay');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  /* Sticky header on scroll */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function openMenu() {
    navMobile.classList.add('open');
    navOverlay.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMobile.classList.remove('open');
    navOverlay.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMobile.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* Newsletter form — placeholder */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim()) {
        input.value = '';
        input.placeholder = 'You\'re on the list! 🎉';
        setTimeout(() => {
          input.placeholder = 'Enter your email';
        }, 3000);
      }
    });
  }

  /* Promo popup */
  const PROMO_STORAGE_KEY = 'slingking-promo-dismissed';
  const promoOverlay = document.getElementById('promo-overlay');
  const promoPopupClose = document.getElementById('promo-popup-close');
  const promoClaimBtn = document.getElementById('promo-claim-btn');
  const promoDismiss = document.getElementById('promo-dismiss');
  const promoTab = document.getElementById('promo-tab');
  const PROMO_CODE = 'SPLASH10';
  const PROMO_APPLIED_KEY = 'slingking-promo-applied';
  const PROMO_DISCOUNT_RATE = 0.1;
  const LAUNCHER_IDS = new Set(['launcher', 'cannon', 'beast']);

  function showPromoTab() {
    if (!promoTab) return;
    promoTab.hidden = false;
    promoTab.classList.remove('is-visible');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        promoTab.classList.add('is-visible');
      });
    });
  }

  function hidePromoPopup() {
    if (!promoOverlay) return;
    promoOverlay.classList.remove('is-visible');
    setTimeout(() => {
      promoOverlay.hidden = true;
    }, 350);
  }

  function openPromoPopup() {
    if (!promoOverlay) return;
    promoOverlay.hidden = false;
    requestAnimationFrame(() => {
      promoOverlay.classList.add('is-visible');
    });
  }

  function dismissPromo() {
    hidePromoPopup();
    showPromoTab();
    sessionStorage.setItem(PROMO_STORAGE_KEY, '1');
  }

  function showToast(message) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'site-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.remove('is-visible');
    void toast.offsetWidth;
    toast.classList.add('is-visible');

    clearTimeout(toast._hideTimer);
    toast._hideTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4000);
  }

  function showPromoPopup() {
    if (!promoOverlay || sessionStorage.getItem(PROMO_STORAGE_KEY)) {
      if (sessionStorage.getItem(PROMO_STORAGE_KEY)) showPromoTab();
      return;
    }
    openPromoPopup();
  }

  if (promoOverlay) {
    setTimeout(showPromoPopup, 4500);

    if (promoPopupClose) promoPopupClose.addEventListener('click', dismissPromo);
    if (promoDismiss) promoDismiss.addEventListener('click', dismissPromo);

    if (promoClaimBtn) {
      promoClaimBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(PROMO_CODE);
        } catch {
          /* clipboard unavailable */
        }
        sessionStorage.setItem(PROMO_APPLIED_KEY, '1');
        dismissPromo();
        showToast('10% has been applied to your order at checkout');
        renderCart();
      });
    }

    promoOverlay.addEventListener('click', (e) => {
      if (e.target === promoOverlay) dismissPromo();
    });
  }

  if (promoTab) {
    promoTab.addEventListener('click', openPromoPopup);
    setTimeout(showPromoTab, 2000);
    if (sessionStorage.getItem(PROMO_STORAGE_KEY)) showPromoTab();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (cartSidebar && cartSidebar.classList.contains('is-open')) {
      closeCartSidebar();
    } else if (promoOverlay && promoOverlay.classList.contains('is-visible')) {
      dismissPromo();
    }
  });

  /* Shopping cart */
  const CART_STORAGE_KEY = 'slingking-cart';
  const PRODUCT_IMAGES = {
    launcher: 'assets/product-launcher.webp',
    cannon: 'assets/product-cannon.webp',
    beast: 'assets/product-beast-mega-launcher.webp',
    'bomber-pack': 'assets/product-bomber-pack.webp',
    'beast-pack': 'assets/product-beast-pack.webp',
    targets: 'assets/product-targets.webp',
  };
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartSidebarBackdrop = document.getElementById('cart-sidebar-backdrop');
  const cartSidebarClose = document.getElementById('cart-sidebar-close');
  const cartToggle = document.getElementById('cart-toggle');
  const cartItemsEl = document.getElementById('cart-items');
  const cartEmptyEl = document.getElementById('cart-empty');
  const cartFooterEl = document.getElementById('cart-footer');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartCountEl = document.getElementById('cart-count');
  const cartCheckoutEl = document.getElementById('cart-checkout');

  function getProductImage(id, fallback) {
    return PRODUCT_IMAGES[id] || (fallback ? fallback.replace(/\.png(\?.*)?$/i, '.webp$1') : '');
  }

  function normalizeCartItem(item) {
    return {
      ...item,
      image: getProductImage(item.id, item.image),
    };
  }

  function getCart() {
    try {
      const cart = JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY)) || [];
      const normalized = cart.map(normalizeCartItem);
      const changed = normalized.some((item, i) => item.image !== cart[i]?.image);
      if (changed) {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
      }
      return normalized;
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderCart();
  }

  function formatMoney(amount) {
    return `$${amount.toFixed(2)}`;
  }

  function isPromoApplied() {
    return sessionStorage.getItem(PROMO_APPLIED_KEY) === '1';
  }

  function isLauncherItem(id) {
    return LAUNCHER_IDS.has(id);
  }

  function getDiscountedUnitPrice(price) {
    return Math.round(price * (1 - PROMO_DISCOUNT_RATE) * 100) / 100;
  }

  function formatItemQtyPrice(item) {
    if (isPromoApplied() && isLauncherItem(item.id)) {
      const discountedUnit = getDiscountedUnitPrice(item.price);
      return `${item.qty} × <s>${formatMoney(item.price)}</s> ${formatMoney(discountedUnit)}`;
    }
    return `${item.qty} × ${formatMoney(item.price)}`;
  }

  function getCartTotals(cart) {
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let discount = 0;

    if (isPromoApplied()) {
      discount = cart.reduce((sum, item) => {
        if (!isLauncherItem(item.id)) return sum;
        return sum + item.price * item.qty * PROMO_DISCOUNT_RATE;
      }, 0);
    }

    discount = Math.round(discount * 100) / 100;
    const total = Math.round((subtotal - discount) * 100) / 100;
    return { itemCount, subtotal, discount, total };
  }

  function updateCartSummary(subtotal, discount, total) {
    const subtotalRow = cartFooterEl?.querySelector('.cart-subtotal-row:not(.cart-total-row)');
    let discountRow = document.getElementById('cart-discount-row');
    let totalRow = document.getElementById('cart-total-row');

    if (discount > 0) {
      if (!discountRow && cartFooterEl && cartCheckoutEl) {
        discountRow = document.createElement('div');
        discountRow.id = 'cart-discount-row';
        discountRow.className = 'cart-discount-row';
        discountRow.innerHTML = '<span>SPLASH10 · 10% off launchers</span><strong id="cart-discount"></strong>';
        cartFooterEl.insertBefore(discountRow, cartCheckoutEl);
      }

      if (!totalRow && cartFooterEl && cartCheckoutEl) {
        totalRow = document.createElement('div');
        totalRow.id = 'cart-total-row';
        totalRow.className = 'cart-subtotal-row cart-total-row';
        totalRow.innerHTML = '<span>Total</span><strong id="cart-total"></strong>';
        cartFooterEl.insertBefore(totalRow, cartCheckoutEl);
      }

      if (subtotalRow) subtotalRow.hidden = false;
      if (discountRow) discountRow.hidden = false;
      if (totalRow) totalRow.hidden = false;
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(subtotal);
      const discountEl = document.getElementById('cart-discount');
      const totalEl = document.getElementById('cart-total');
      if (discountEl) discountEl.textContent = `-${formatMoney(discount)}`;
      if (totalEl) totalEl.textContent = formatMoney(total);
    } else {
      if (subtotalRow) subtotalRow.hidden = false;
      if (discountRow) discountRow.hidden = true;
      if (totalRow) totalRow.hidden = true;
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(subtotal);
    }
  }

  function renderCart() {
    const cart = getCart();
    const { itemCount, subtotal, discount, total } = getCartTotals(cart);

    if (cartCountEl) {
      cartCountEl.textContent = String(itemCount);
      cartCountEl.hidden = itemCount === 0;
    }

    if (!cartItemsEl || !cartEmptyEl || !cartFooterEl) return;

    if (cart.length === 0) {
      cartEmptyEl.hidden = false;
      cartItemsEl.hidden = true;
      cartItemsEl.innerHTML = '';
      cartFooterEl.hidden = true;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      const discountRow = document.getElementById('cart-discount-row');
      const totalRow = document.getElementById('cart-total-row');
      if (discountRow) discountRow.hidden = true;
      if (totalRow) totalRow.hidden = true;
      return;
    }

    cartEmptyEl.hidden = true;
    cartItemsEl.hidden = false;
    cartFooterEl.hidden = false;
    updateCartSummary(subtotal, discount, total);

    cartItemsEl.innerHTML = cart.map((item) => `
      <li class="cart-item" data-cart-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${formatItemQtyPrice(item)}</span>
        </div>
        <button type="button" class="cart-item-remove" data-remove-id="${item.id}" aria-label="Remove ${item.name}">Remove</button>
      </li>
    `).join('');

    cartItemsEl.querySelectorAll('[data-remove-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.removeId;
        saveCart(getCart().filter((item) => item.id !== id));
      });
    });

    if (cartCheckoutEl) {
      const lines = cart.map((item) => {
        let lineTotal = item.price * item.qty;
        if (isPromoApplied() && isLauncherItem(item.id)) {
          lineTotal = getDiscountedUnitPrice(item.price) * item.qty;
        }
        return `${item.qty}x ${item.name} (${formatMoney(lineTotal)})`;
      });

      let summary = `Subtotal: ${formatMoney(subtotal)}`;
      if (discount > 0) {
        summary += `\nPromo SPLASH10 (10% off launchers): -${formatMoney(discount)}`;
        summary += `\nTotal: ${formatMoney(total)}`;
      }

      const body = encodeURIComponent(`${lines.join('\n')}\n\n${summary}`);
      cartCheckoutEl.href = `mailto:info@slingking.com?subject=${encodeURIComponent('Slingking Order')}&body=${body}`;
    }
  }

  function openCartSidebar() {
    if (!cartSidebar) return;
    renderCart();
    cartSidebar.classList.add('is-open');
    cartSidebar.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-sidebar-open');
  }

  function closeCartSidebar() {
    if (!cartSidebar) return;
    cartSidebar.classList.remove('is-open');
    cartSidebar.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-sidebar-open');
  }

  function addToCart(product, qty) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    const image = getProductImage(product.id, product.image);
    if (existing) {
      existing.qty += qty;
      existing.image = image;
    } else {
      cart.push({ ...product, image, qty });
    }
    saveCart(cart);
    openCartSidebar();
  }

  if (cartToggle) cartToggle.addEventListener('click', openCartSidebar);
  if (cartSidebarClose) cartSidebarClose.addEventListener('click', closeCartSidebar);
  if (cartSidebarBackdrop) cartSidebarBackdrop.addEventListener('click', closeCartSidebar);

  document.querySelectorAll('.product-add-form').forEach((form) => {
    const qtyInput = form.querySelector('.qty-input');
    const minusBtn = form.querySelector('.qty-minus');
    const plusBtn = form.querySelector('.qty-plus');

    function clampQty() {
      const val = Math.max(1, Math.min(99, Number(qtyInput.value) || 1));
      qtyInput.value = String(val);
      return val;
    }

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        qtyInput.value = String(Math.max(1, Number(qtyInput.value) - 1));
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        qtyInput.value = String(Math.min(99, Number(qtyInput.value) + 1));
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const qty = clampQty();
      addToCart({
        id: form.dataset.productId,
        name: form.dataset.productName,
        price: Number(form.dataset.productPrice),
        image: form.dataset.productImage,
      }, qty);
    });
  });

  renderCart();

  /* Hero product slideshow */
  const heroSlideshow = document.querySelector('.hero-slideshow');
  if (heroSlideshow) {
    const slides = heroSlideshow.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const rangeValue = document.querySelector('.hero-range-value');
    const rangeLabel = document.querySelector('.hero-range-label');
    const rangeBadge = document.querySelector('.hero-range-badge');
    let currentIndex = 0;
    let timerId = null;
    let isAnimating = false;
    const intervalMs = 4500;
    const transitionMs = 700;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function getDirection(from, to) {
      if (from === to) return 0;
      const forward = (to - from + slides.length) % slides.length;
      const backward = (from - to + slides.length) % slides.length;
      return forward <= backward ? 1 : -1;
    }

    function updateCardRange(slide) {
      if (!slide) return;
      const range = slide.dataset.range;
      const label = slide.dataset.label;
      if (rangeValue) rangeValue.textContent = range;
      if (rangeLabel) rangeLabel.textContent = label;
      if (rangeBadge) {
        rangeBadge.classList.remove('is-updating');
        void rangeBadge.offsetWidth;
        rangeBadge.classList.add('is-updating');
      }
    }

    function clearSlideMotionClasses() {
      slides.forEach((slide) => {
        slide.classList.remove('is-enter-right', 'is-enter-left', 'is-exit-left', 'is-exit-right');
      });
    }

    function goToSlide(index) {
      const nextIndex = (index + slides.length) % slides.length;
      if (nextIndex === currentIndex || isAnimating) return;

      const direction = getDirection(currentIndex, nextIndex);
      const prevSlide = slides[currentIndex];
      const nextSlide = slides[nextIndex];

      if (reducedMotion) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('is-active', i === nextIndex);
        });
        updateCardRange(nextSlide);
        currentIndex = nextIndex;
      } else {
        isAnimating = true;
        clearSlideMotionClasses();

        prevSlide.classList.remove('is-active');
        nextSlide.classList.add('is-active');

        if (direction > 0) {
          prevSlide.classList.add('is-exit-left');
          nextSlide.classList.add('is-enter-right');
        } else {
          prevSlide.classList.add('is-exit-right');
          nextSlide.classList.add('is-enter-left');
        }

        updateCardRange(nextSlide);

        window.setTimeout(() => {
          clearSlideMotionClasses();
          isAnimating = false;
        }, transitionMs);
        currentIndex = nextIndex;
      }

      dots.forEach((dot, i) => {
        const isActive = i === nextIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function startAutoplay() {
      if (reducedMotion || slides.length < 2) return;
      stopAutoplay();
      timerId = window.setInterval(nextSlide, intervalMs);
    }

    function stopAutoplay() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goToSlide(Number(dot.dataset.slide));
        startAutoplay();
      });
    });

    heroSlideshow.addEventListener('mouseenter', stopAutoplay);
    heroSlideshow.addEventListener('mouseleave', startAutoplay);
    heroSlideshow.addEventListener('focusin', stopAutoplay);
    heroSlideshow.addEventListener('focusout', startAutoplay);

    startAutoplay();
  }

  /* Homepage video play overlay */
  const homepageVideoPlayer = document.getElementById('homepage-video-player');
  const homepageVideo = document.getElementById('homepage-video');
  const homepageVideoOverlay = document.getElementById('homepage-video-overlay');

  function hideVideoOverlay() {
    homepageVideoPlayer?.classList.add('is-playing');
  }

  function showVideoOverlay() {
    homepageVideoPlayer?.classList.remove('is-playing');
  }

  homepageVideoOverlay?.addEventListener('click', () => {
    if (!homepageVideo) return;
    homepageVideo.play();
    hideVideoOverlay();
  });

  homepageVideo?.addEventListener('play', hideVideoOverlay);

  homepageVideo?.addEventListener('pause', () => {
    if (!homepageVideo) return;
    if (homepageVideo.currentTime === 0 || homepageVideo.ended) {
      showVideoOverlay();
    }
  });

  homepageVideo?.addEventListener('ended', showVideoOverlay);

  /* Smooth reveal on scroll */
  const revealEls = document.querySelectorAll('.product-compare-table-wrap, .product-card, .accessory-card, .feature-card, .audience-card, .action-gallery-item, .video-placeholder, .team-logos-wall, .as-seen-inner, .about-inner');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
})();
