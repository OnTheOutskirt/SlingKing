const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const siteExtras = fs.readFileSync(path.join(root, 'partials', 'site-extras.html'), 'utf8');

function head(title, description, bodyClass = 'page-inner') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="${bodyClass}">`;
}

function header(active) {
  const nav = [
    ['launcher.html', 'Launcher'],
    ['cannon.html', 'Cannon'],
    ['beast.html', 'Beast'],
    ['accessories.html', 'Accessories'],
    ['about.html', 'About'],
  ];
  const desktop = nav.map(([href, label]) => {
    const cls = active === href ? ' class="is-active"' : '';
    return `        <a href="${href}"${cls}>${label}</a>`;
  }).join('\n');
  const mobile = nav.map(([href, label]) => {
    const cls = active === href ? ' class="is-active"' : '';
    return `      <li><a href="${href}"${cls}>${label}</a></li>`;
  }).join('\n');
  const contactCls = active === 'contact.html' ? ' class="is-active"' : '';

  return `  <header class="site-header">
    <div class="container">
      <a href="index.html" class="logo" aria-label="Slingking home">
        <img src="assets/logo.webp" alt="Slingking">
      </a>

      <nav class="nav-desktop" aria-label="Main navigation">
${desktop}
      </nav>

      <div class="header-actions">
        <a href="shop.html" class="btn btn-primary header-shop-btn">Shop Now</a>
        <button class="icon-btn cart-btn" id="cart-toggle" aria-label="Open cart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>
          <span class="cart-count" id="cart-count" hidden>0</span>
        </button>
        <button class="icon-btn menu-toggle" aria-label="Open menu" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>
      </div>
    </div>
  </header>

  <div class="nav-overlay" aria-hidden="true"></div>
  <nav class="nav-mobile" aria-label="Mobile navigation">
    <ul>
${mobile}
      <li><a href="contact.html"${contactCls}>Contact</a></li>
    </ul>
  </nav>`;
}

function footer() {
  return `  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="assets/logo.webp" alt="Slingking">
          <p>The original water balloon slingshot since 1988. Complete kits with patented Fill Anywhere™ — just add water.</p>
        </div>

        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="shop.html">Shop All Products</a></li>
            <li><a href="launcher.html">Original Launcher</a></li>
            <li><a href="cannon.html">Water Balloon Cannon</a></li>
            <li><a href="beast.html">Beast Mega Slingshot</a></li>
            <li><a href="accessories.html">Accessories</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="shipping-info.html">Shipping Info</a></li>
            <li><a href="returns-guarantee.html">Returns &amp; Guarantee</a></li>
            <li><a href="safety-guidelines.html">Safety Guidelines</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About Slingking</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-meta">
          <p>&copy; 2026 4D Innovations. All rights reserved. Katy, TX.</p>
          <nav class="footer-legal" aria-label="Legal">
            <a href="terms-of-service.html">Terms of Service</a>
            <a href="privacy-policy.html">Privacy Policy</a>
          </nav>
        </div>
        <div class="payment-icons">
          <span>VISA</span>
          <span>MC</span>
          <span>AMEX</span>
          <span>PAYPAL</span>
          <span>APPLE PAY</span>
          <span>SHOP PAY</span>
        </div>
      </div>
    </div>
  </footer>

${siteExtras}
  <script src="js/main.js"></script>
</body>
</html>`;
}

function page(active, title, description, body, options = {}) {
  const bodyClass = options.lightHero ? 'page-inner page-inner--light-hero' : 'page-inner';
  return `${head(title, description, bodyClass)}
${header(active)}

  <main class="page-main">
${body}
  </main>

${footer()}`;
}

function renderRelatedCards(related) {
  return related.map((r) => `
          <a href="${r.href}" class="related-card${r.accessory ? ' related-card--accessory' : ''}">
            <div class="related-card-image">
              <img src="${r.img}" alt="">
            </div>
            <div class="related-card-body">
              <strong>${r.name}</strong>
              <span>${r.meta}</span>
              <span class="related-card-cta">View</span>
            </div>
          </a>`).join('');
}

function productDetailsSection(specsHtml, includesHtml) {
  return `    <section class="product-details-section">
      <div class="container">
        <div class="product-details">
          <dl class="product-specs">${specsHtml}
          </dl>
          <div class="product-includes">
            <h3>What's Included</h3>
            <ul>
            ${includesHtml}
            </ul>
          </div>
        </div>
      </div>
    </section>`;
}

function productPage(config) {
  const related = renderRelatedCards(config.related);

  const specs = config.specs.map(([k, v]) => `
              <dt>${k}</dt>
              <dd>${v}</dd>`).join('');

  const includes = config.includes.map((i) => `<li>${i}</li>`).join('\n              ');

  return page(
    config.file,
    config.title,
    config.description,
    `    <section class="page-hero">
      <div class="container">
        <span class="section-label">${config.label}</span>
        <h1 class="display-lg">${config.heading}</h1>
        <p>${config.heroText}</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container">
        <div class="product-page-grid">
          <div class="product-page-visual">
            <img src="${config.img}" alt="${config.imgAlt}">
          </div>
          <div class="product-page-info">
            <span class="product-page-badge product-page-badge--${config.badgeType}">${config.badge}</span>
            <div class="product-page-range">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>
              ${config.range}
            </div>
            <h2 class="display-md">${config.name}</h2>
            <p>${config.intro}</p>
            <p class="product-page-price">${config.price}</p>
            <form class="product-add-form" data-product-id="${config.id}" data-product-name="${config.name}" data-product-price="${config.priceNum}" data-product-image="${config.img}">
              <div class="product-qty">
                <label for="qty-${config.id}">Quantity</label>
                <div class="qty-selector">
                  <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>
                  <input type="number" id="qty-${config.id}" class="qty-input" value="1" min="1" max="99" aria-label="Quantity">
                  <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary product-add-btn">Add to Cart</button>
            </form>
          </div>
        </div>
      </div>
    </section>

${productDetailsSection(specs, includes)}

    <section class="related-products">
      <div class="container">
        <h2 class="display-md">Complete Your Kit</h2>
        <div class="related-grid">${related}
        </div>
      </div>
    </section>`
  );
}

function accessoryListingCard({ href, img, alt, name, desc, price, priceCompare }) {
  const priceHtml = priceCompare
    ? `$${price}<small>$${priceCompare}</small>`
    : `$${price}`;

  return `
          <a href="${href}" class="accessory-card accessory-card--link">
            <div class="product-image">
              <img src="${img}" alt="${alt}">
            </div>
            <div class="product-body">
              <h3>${name}</h3>
              <p>${desc}</p>
              <div class="product-footer">
                <span class="product-price accessory-price">${priceHtml}</span>
                <span class="product-link accessory-link">
                  View
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                </span>
              </div>
            </div>
          </a>`;
}

function accessoryPage(config) {
  const related = renderRelatedCards(config.related);

  const specs = config.specs.map(([k, v]) => `
              <dt>${k}</dt>
              <dd>${v}</dd>`).join('');

  const includes = config.includes.map((i) => `<li>${i}</li>`).join('\n              ');

  const priceDisplay = config.priceCompare
    ? `${config.price}<small>${config.priceCompare}</small>`
    : config.price;

  return page(
    'accessories.html',
    config.title,
    config.description,
    `    <section class="page-hero">
      <div class="container">
        <span class="section-label">${config.label}</span>
        <h1 class="display-lg">${config.heading}</h1>
        <p>${config.heroText}</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container">
        <div class="product-page-grid">
          <div class="product-page-visual product-page-visual--square">
            <img src="${config.img}" alt="${config.imgAlt}">
          </div>
          <div class="product-page-info">
            <span class="product-page-badge product-page-badge--accessory">${config.badge}</span>
            <div class="product-page-meta">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/></svg>
              ${config.meta}
            </div>
            <h2 class="display-md">${config.name}</h2>
            <p>${config.intro}</p>
            <p class="product-page-price">${priceDisplay}</p>
            <form class="product-add-form" data-product-id="${config.id}" data-product-name="${config.name}" data-product-price="${config.priceNum}" data-product-image="${config.img}">
              <div class="product-qty">
                <label for="qty-${config.id}">Quantity</label>
                <div class="qty-selector">
                  <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>
                  <input type="number" id="qty-${config.id}" class="qty-input" value="1" min="1" max="99" aria-label="Quantity">
                  <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary product-add-btn">Add to Cart</button>
            </form>
          </div>
        </div>
      </div>
    </section>

${productDetailsSection(specs, includes)}

    <section class="related-products">
      <div class="container">
        <h2 class="display-md">Explore the Launchers</h2>
        <div class="related-grid">${related}
        </div>
      </div>
    </section>`
  );
}

function shopAccessoryCard({ href, img, alt, name, desc, price, priceCompare, id, priceNum }) {
  const priceHtml = priceCompare
    ? `$${price}<small>$${priceCompare}</small>`
    : `$${price}`;

  return `
          <article class="accessory-card">
            <a href="${href}" class="product-image-link" aria-label="View ${name}">
            <div class="product-image">
              <img src="${img}" alt="${alt}">
            </div>
            </a>
            <div class="product-body">
              <h3><a href="${href}">${name}</a></h3>
              <p>${desc}</p>
              <span class="product-price accessory-price">${priceHtml}</span>
${shopAddForm(id, name, priceNum, img, 'Cart')}
            </div>
          </article>`;
}

function shopAddForm(id, name, price, image, label = 'Add to Cart') {
  return `              <form class="product-add-form product-add-form--card" data-product-id="${id}" data-product-name="${name}" data-product-price="${price}" data-product-image="${image}">
                <div class="qty-selector">
                  <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>
                  <input type="number" class="qty-input" value="1" min="1" max="99" aria-label="Quantity">
                  <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                </div>
                <button type="submit" class="btn btn-primary product-add-btn">${label}</button>
              </form>`;
}

const pages = {
  'shop.html': page(
    'shop.html',
    'Shop Now — Slingking® Launchers & Accessories',
    'Shop all Slingking® water balloon launchers and accessories. Launcher, Cannon, Beast, and official refill packs.',
    `    <section class="page-hero">
      <div class="container">
        <span class="section-label">Shop Now</span>
        <h1 class="display-lg">The Full Slingking® Lineup</h1>
        <p>Three legendary launchers and official accessories — every kit ships ready to fire. Just add water.</p>
      </div>
    </section>

    <section class="products-section shop-page-launchers" id="launchers">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Launchers</span>
          <h2 class="display-md">Official Slingking® Launchers</h2>
          <p>From backyard starter kits to stadium-grade mega slingshots.</p>
        </div>
        <div class="products-grid">
          <article class="product-card">
            <span class="product-badge solo">The Original</span>
            <div class="product-image">
              <a href="launcher.html"><img src="assets/product-launcher.webp" alt="Slingking Water Balloon Launcher"></a>
            </div>
            <div class="product-body">
              <div class="product-range">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>
                Up to 100 Yards
              </div>
              <h3><a href="launcher.html">Water Balloon Launcher™</a></h3>
              <p>The original wrist-rocket slingshot. Complete kit with filler system &amp; 100 biodegradable balloons.</p>
              <span class="product-price">$32.95</span>
${shopAddForm('launcher', 'Water Balloon Launcher™', '32.95', 'assets/product-launcher.webp')}
            </div>
          </article>
          <article class="product-card">
            <span class="product-badge team">3-Man Team</span>
            <div class="product-image">
              <a href="cannon.html"><img src="assets/product-cannon.webp" alt="Slingking Water Balloon Cannon"></a>
            </div>
            <div class="product-body">
              <div class="product-range">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>
                Up to 200 Yards
              </div>
              <h3><a href="cannon.html">Water Balloon Cannon™</a></h3>
              <p>Heavy-duty 3-man handheld cannon. Launches 3″ balloons with serious force. Stay mobile, stay loaded.</p>
              <span class="product-price">$38.95</span>
${shopAddForm('cannon', 'Water Balloon Cannon™', '38.95', 'assets/product-cannon.webp')}
            </div>
          </article>
          <article class="product-card featured">
            <span class="product-badge flagship">Flagship</span>
            <div class="product-image">
              <a href="beast.html"><img src="assets/product-beast-mega-launcher.webp" alt="Slingking Beast Mega Slingshot"></a>
            </div>
            <div class="product-body">
              <div class="product-range">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>
                Up to 300 Yards
              </div>
              <h3><a href="beast.html">Beast™ Mega Slingshot™</a></h3>
              <p>Triple-barrel, mountable mega slingshot. Three friends, one synchronized volley. The ultimate team weapon.</p>
              <span class="product-price">$43.95</span>
${shopAddForm('beast', 'Beast™ Mega Slingshot™', '43.95', 'assets/product-beast-mega-launcher.webp')}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="accessories shop-page-accessories" id="accessories">
      <div class="container">
        <div class="section-header section-header--compact">
          <span class="section-label">Gear Up</span>
          <h2 class="display-md">Official Accessories</h2>
          <p>Refill ammo, add targets, and keep the battle going all summer.</p>
        </div>
        <div class="accessories-grid">
${shopAccessoryCard({
    href: 'bomber-pack.html',
    img: 'assets/product-bomber-pack.webp',
    alt: 'Slingking Bomber-Pack water balloon refill',
    name: 'Bomber-Pack™',
    desc: '100 biodegradable water balloons. Restock for the next round.',
    price: '5',
    priceCompare: '6.99',
    id: 'bomber-pack',
    priceNum: '5',
  })}${shopAccessoryCard({
    href: 'beast-pack.html',
    img: 'assets/product-beast-pack.webp',
    alt: 'Slingking Beast-Pack water balloon refill',
    name: 'Beast-Pack™',
    desc: '150 water balloons for extended Beast Mega Slingshot battles.',
    price: '7',
    priceCompare: '9.25',
    id: 'beast-pack',
    priceNum: '7',
  })}${shopAccessoryCard({
    href: 'targets.html',
    img: 'assets/product-targets.webp',
    alt: 'Slingking Water Balloon Targets',
    name: 'Water Balloon Targets™',
    desc: '10 official Slingking® target boards. Perfect your aim from 100 yards out.',
    price: '5',
    priceCompare: '8',
    id: 'targets',
    priceNum: '5',
  })}
        </div>
      </div>
    </section>`
  ),

  'launcher.html': productPage({
    file: 'launcher.html',
    id: 'launcher',
    priceNum: '32.95',
    title: 'Water Balloon Launcher™ — Slingking®',
    description: 'The original Slingking Water Balloon Launcher™. Complete kit with patented Fill Anywhere™ system. Up to 100 yards. $32.95.',
    label: 'The Original',
    heading: 'Water Balloon Launcher™',
    heroText: 'The wrist-rocket that started it all. Backyard battles, summer camps, and the perfect starter kit.',
    img: 'assets/product-launcher.webp',
    imgAlt: 'Slingking Water Balloon Launcher kit',
    badgeType: 'solo',
    badge: 'The Original',
    range: 'Up to 100 Yards',
    name: 'Water Balloon Launcher™',
    intro: 'The original wrist-rocket slingshot that put Slingking on the map. Solo operation, serious range, and our patented Fill Anywhere™ system so you can load up at the park — no hose required.',
    price: '$32.95',
    orderSubject: 'Order Water Balloon Launcher',
    specs: [
      ['Range', 'Up to 100 yards'],
      ['Operation', 'Solo'],
      ['Best For', 'Backyards, camps &amp; families'],
      ['Balloon Size', 'Standard water balloons'],
    ],
    includes: [
      'Slingking® Water Balloon Launcher™',
      'Patented Fill Anywhere™ filler system',
      '100 biodegradable water balloons',
      'Instruction guide',
    ],
    related: [
      { href: 'cannon.html', img: 'assets/product-cannon.webp', name: 'Water Balloon Cannon™', meta: '200 yards · 3-man team' },
      { href: 'beast.html', img: 'assets/product-beast-mega-launcher.webp', name: 'Beast™ Mega Slingshot™', meta: '300 yards · flagship' },
      { href: 'bomber-pack.html', img: 'assets/product-bomber-pack.webp', name: 'Bomber-Pack™', meta: '100 balloon refill · $5', accessory: true },
    ],
  }),

  'cannon.html': productPage({
    file: 'cannon.html',
    id: 'cannon',
    priceNum: '38.95',
    title: 'Water Balloon Cannon™ — Slingking®',
    description: 'Slingking Water Balloon Cannon™ — heavy-duty 3-man handheld launcher. Up to 200 yards. $38.95.',
    label: '3-Man Team',
    heading: 'Water Balloon Cannon™',
    heroText: 'Mobile firepower for block parties, Greek Week, and serious soak missions.',
    img: 'assets/product-cannon.webp',
    imgAlt: 'Slingking Water Balloon Cannon',
    badgeType: 'team',
    badge: '3-Man Team',
    range: 'Up to 200 Yards',
    name: 'Water Balloon Cannon™',
    intro: 'A heavy-duty handheld cannon built for three-person crews. Launches 3″ balloons with serious force while staying mobile — perfect for philanthropy events, field battles, and roaming assaults.',
    price: '$38.95',
    orderSubject: 'Order Water Balloon Cannon',
    specs: [
      ['Range', 'Up to 200 yards'],
      ['Operation', '3-person team'],
      ['Best For', 'Mobile battles &amp; events'],
      ['Balloon Size', '3″ water balloons'],
    ],
    includes: [
      'Slingking® Water Balloon Cannon™',
      'Patented Fill Anywhere™ filler system',
      '100 biodegradable water balloons',
      'Team operation guide',
    ],
    related: [
      { href: 'launcher.html', img: 'assets/product-launcher.webp', name: 'Water Balloon Launcher™', meta: '100 yards · solo starter' },
      { href: 'beast.html', img: 'assets/product-beast-mega-launcher.webp', name: 'Beast™ Mega Slingshot™', meta: '300 yards · flagship' },
      { href: 'targets.html', img: 'assets/product-targets.webp', name: 'Water Balloon Targets™', meta: '10 target boards · $5', accessory: true },
    ],
  }),

  'beast.html': productPage({
    file: 'beast.html',
    id: 'beast',
    priceNum: '43.95',
    title: 'Beast™ Mega Slingshot™ — Slingking®',
    description: 'Slingking Beast™ Mega Slingshot™ — triple-barrel mountable mega launcher. Up to 300 yards. $43.95.',
    label: 'Flagship',
    heading: 'Beast™ Mega Slingshot™',
    heroText: 'Triple-barrel, mountable mega slingshot. The ultimate team weapon for Greek life and large events.',
    img: 'assets/product-beast-mega-launcher.webp',
    imgAlt: 'Slingking Beast Mega Slingshot',
    badgeType: 'flagship',
    badge: 'Flagship',
    range: 'Up to 300 Yards',
    name: 'Beast™ Mega Slingshot™',
    intro: 'Our flagship triple-barrel mega slingshot mounts to decks, roofs, and poolside setups. Three friends, one synchronized volley, and up to 300 yards of soakage. Built for Greek Week, fundraisers, and all-out water wars.',
    price: '$43.95',
    orderSubject: 'Order Beast Mega Slingshot',
    specs: [
      ['Range', 'Up to 300 yards'],
      ['Operation', 'Mountable team launcher'],
      ['Best For', 'Greek life &amp; large events'],
      ['Barrels', 'Triple-barrel synchronized fire'],
    ],
    includes: [
      'Slingking® Beast™ Mega Slingshot™',
      'Patented Fill Anywhere™ filler system',
      '100 biodegradable water balloons',
      'Mounting hardware &amp; setup guide',
    ],
    related: [
      { href: 'launcher.html', img: 'assets/product-launcher.webp', name: 'Water Balloon Launcher™', meta: '100 yards · solo starter' },
      { href: 'cannon.html', img: 'assets/product-cannon.webp', name: 'Water Balloon Cannon™', meta: '200 yards · 3-man team' },
      { href: 'beast-pack.html', img: 'assets/product-beast-pack.webp', name: 'Beast-Pack™', meta: '150 balloon refill · from $7', accessory: true },
    ],
  }),

  'bomber-pack.html': accessoryPage({
    file: 'bomber-pack.html',
    id: 'bomber-pack',
    priceNum: '5',
    title: 'Bomber-Pack™ — Slingking®',
    description: 'Slingking Bomber-Pack™ — 100 biodegradable water balloon refill. Restock your launcher for the next battle. $5.',
    label: 'Refill Ammo',
    heading: 'Bomber-Pack™',
    heroText: 'Standard balloon refill for backyard battles, camps, and all-day soak missions.',
    img: 'assets/product-bomber-pack.webp',
    imgAlt: 'Slingking Bomber-Pack water balloon refill',
    badge: 'Refill Pack',
    meta: '100 Balloons',
    name: 'Bomber-Pack™',
    intro: 'Keep the ammo flowing with 100 official Slingking® biodegradable water balloons. The perfect restock for your Water Balloon Launcher™ or Cannon — same quality balloons that ship in every complete kit.',
    price: '$5',
    priceCompare: '$6.99',
    specs: [
      ['Quantity', '100 biodegradable water balloons'],
      ['Balloon Size', 'Standard water balloons'],
      ['Best For', 'Launcher &amp; Cannon refills'],
      ['Compatible With', 'All Slingking® launchers'],
    ],
    includes: [
      '100 biodegradable water balloons',
      'Resealable storage bag',
    ],
    related: [
      { href: 'launcher.html', img: 'assets/product-launcher.webp', name: 'Water Balloon Launcher™', meta: '100 yards · solo starter' },
      { href: 'cannon.html', img: 'assets/product-cannon.webp', name: 'Water Balloon Cannon™', meta: '200 yards · 3-man team' },
      { href: 'beast.html', img: 'assets/product-beast-mega-launcher.webp', name: 'Beast™ Mega Slingshot™', meta: '300 yards · flagship' },
    ],
  }),

  'beast-pack.html': accessoryPage({
    file: 'beast-pack.html',
    id: 'beast-pack',
    priceNum: '7',
    title: 'Beast-Pack™ — Slingking®',
    description: 'Slingking Beast-Pack™ — 150 water balloon refill for extended Beast Mega Slingshot battles. From $7.',
    label: 'High-Volume Refill',
    heading: 'Beast-Pack™',
    heroText: 'Extra ammo for mega slingshot battles — Greek Week, fundraisers, and all-out water wars.',
    img: 'assets/product-beast-pack.webp',
    imgAlt: 'Slingking Beast-Pack water balloon refill',
    badge: 'Beast Refill',
    meta: '150 Balloons',
    name: 'Beast-Pack™',
    intro: 'When one volley is not enough, load up with 150 official Slingking® biodegradable water balloons. Built for extended Beast Mega Slingshot™ sessions where your crew needs serious soak capacity.',
    price: '$7',
    priceCompare: '$9.25',
    specs: [
      ['Quantity', '150 biodegradable water balloons'],
      ['Balloon Size', 'Standard water balloons'],
      ['Best For', 'Extended Beast Mega battles'],
      ['Compatible With', 'Beast™ Mega Slingshot™ &amp; all launchers'],
    ],
    includes: [
      '150 biodegradable water balloons',
      'Resealable storage bag',
    ],
    related: [
      { href: 'launcher.html', img: 'assets/product-launcher.webp', name: 'Water Balloon Launcher™', meta: '100 yards · solo starter' },
      { href: 'cannon.html', img: 'assets/product-cannon.webp', name: 'Water Balloon Cannon™', meta: '200 yards · 3-man team' },
      { href: 'beast.html', img: 'assets/product-beast-mega-launcher.webp', name: 'Beast™ Mega Slingshot™', meta: '300 yards · flagship' },
    ],
  }),

  'targets.html': accessoryPage({
    file: 'targets.html',
    id: 'targets',
    priceNum: '5',
    title: 'Water Balloon Targets™ — Slingking®',
    description: 'Official Slingking Water Balloon Targets™ — 10 target boards for aim practice up to 100 yards. $5.',
    label: 'Sharpen Your Aim',
    heading: 'Water Balloon Targets™',
    heroText: 'Official target boards for competitions, training, and precision soak missions.',
    img: 'assets/product-targets.webp',
    imgAlt: 'Slingking Water Balloon Targets',
    badge: 'Target Practice',
    meta: '10 Target Boards',
    name: 'Water Balloon Targets™',
    intro: 'Set up an official Slingking® target range and dial in your accuracy from across the yard — or across the field. Ten lightweight boards stake into the ground and handle repeated direct hits.',
    price: '$5',
    priceCompare: '$8',
    specs: [
      ['Quantity', '10 official target boards'],
      ['Setup', 'Lightweight, easy to stake'],
      ['Best For', 'Aim practice &amp; competitions'],
      ['Effective Range', 'Up to 100 yards'],
    ],
    includes: [
      '10 official Slingking® target boards',
      'Setup instructions',
    ],
    related: [
      { href: 'launcher.html', img: 'assets/product-launcher.webp', name: 'Water Balloon Launcher™', meta: '100 yards · solo starter' },
      { href: 'cannon.html', img: 'assets/product-cannon.webp', name: 'Water Balloon Cannon™', meta: '200 yards · 3-man team' },
      { href: 'beast.html', img: 'assets/product-beast-mega-launcher.webp', name: 'Beast™ Mega Slingshot™', meta: '300 yards · flagship' },
    ],
  }),

  'accessories.html': page(
    'accessories.html',
    'Accessories — Slingking®',
    'Official Slingking accessories — Bomber-Pack, Beast-Pack, and Water Balloon Targets. Refill ammo and gear up.',
    `    <section class="page-hero">
      <div class="container">
        <span class="section-label">Gear Up</span>
        <h1 class="display-lg">Official Accessories</h1>
        <p>Refill ammo, add targets, and keep the battle going all summer.</p>
      </div>
    </section>

    <section class="page-body page-body--alt">
      <div class="container">
        <div class="accessories-grid accessories-page-grid">${accessoryListingCard({
    href: 'bomber-pack.html',
    img: 'assets/product-bomber-pack.webp',
    alt: 'Slingking Bomber-Pack water balloon refill',
    name: 'Bomber-Pack™',
    desc: '100 biodegradable water balloons. Restock for the next round.',
    price: '5',
    priceCompare: '6.99',
  })}${accessoryListingCard({
    href: 'beast-pack.html',
    img: 'assets/product-beast-pack.webp',
    alt: 'Slingking Beast-Pack water balloon refill',
    name: 'Beast-Pack™',
    desc: '150 water balloons for extended Beast Mega Slingshot battles.',
    price: '7',
    priceCompare: '9.25',
  })}${accessoryListingCard({
    href: 'targets.html',
    img: 'assets/product-targets.webp',
    alt: 'Slingking Water Balloon Targets',
    name: 'Water Balloon Targets™',
    desc: '10 official Slingking® target boards. Perfect your aim from 100 yards out.',
    price: '5',
    priceCompare: '8',
  })}
        </div>
        <p style="text-align:center;margin-top:2rem;"><a href="shop.html" class="btn btn-primary">Shop All Products</a></p>
      </div>
    </section>`
  ),

  'about.html': page(
    'about.html',
    'About Slingking® — Water Balloon Slingshots, Launchers & Cannons',
    'Learn about Slingking® — the leader in outdoor water fun since 1988. Patented Fill Anywhere™ launchers trusted by celebrities, families, and pro sports venues.',
    `    <section class="page-hero">
      <div class="container">
        <span class="section-label">Our Story</span>
        <h1 class="display-lg">About Slingking® Water Balloon Slingshots, Launchers and Cannons</h1>
        <p>The leader in outdoor water fun since 1988 — high-quality materials and the best guarantee in the business.</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container">
        <div class="about-inner about-page-intro">
          <div class="about-copy">
            <p>Get ready to elevate your outdoor water fun with Slingking® water balloon slingshots — the ultimate trendsetter since 1988. Experience the unbeatable thrill of our high-quality materials and the industry's best guarantee.</p>
            <p>Slingking® Kits feature our exclusive <strong>Patented Launcher</strong>, available only through Slingking® and its trusted affiliates. Say goodbye to imitation slingshots and embrace vibrant colors, top-notch tubing, and our convenient Fill Anywhere™ balloon filler. Each Slingking® water balloon launcher is shipped in a complete kit — just add water and let the adventure begin!</p>
            <div class="about-stats">
              <div class="about-stat"><strong>1988</strong><span>Founded</span></div>
              <div class="about-stat"><strong>300 YD</strong><span>Max Range</span></div>
              <div class="about-stat"><strong>Patented</strong><span>Fill Anywhere™</span></div>
            </div>
            <div class="about-cta-row about-cta-row--start">
              <a href="shop.html" class="btn btn-primary">Shop the Lineup</a>
              <a href="launcher.html" class="btn btn-secondary">Get the Original</a>
            </div>
          </div>
          <figure class="about-image about-image--photo">
            <img src="assets/slingking-1988.webp" alt="Original Slingking water balloon catapult kit from 1988 with vintage packaging on a picnic table" loading="lazy">
          </figure>
        </div>
      </div>
    </section>

    <section class="page-body page-body--alt">
      <div class="container about-content-block">
        <h2>What Sets Slingking Apart</h2>
        <p>Slingking® water balloon slingshots have been the leader in outdoor water fun since 1988. What makes our kits completely unique is that the Patented Launcher is <em>only</em> available through Slingking® or its affiliates — vibrant colors and our exclusive fill-anywhere balloon filler are not available with other imitation slingshots.</p>
        <p>All Slingking® water balloon launchers ship in ready-to-use kits. No hunting for parts, no dollar-store tubing that snaps after one afternoon. From backyard battles and summer camps to Greek Week block parties, Slingking delivers maximum soakage out of the box.</p>
        <div class="about-highlight">
          <figure class="about-highlight-image">
            <img src="assets/water-balloon-filling-bottle.webp" alt="Slingking Fill Anywhere collapsible water balloon filling bottle" loading="lazy">
          </figure>
          <div class="about-highlight-copy">
            <strong>Fill Anywhere™</strong>
            <p>Our exclusive balloon filling system lets you fill water balloons anywhere — with or without a faucet. Our special cap fits a standard outdoor faucet or garden sprayer, and the collapsible bottle lets you fill balloons on the go. No hose? No problem.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="page-body">
      <div class="container about-content-block">
        <h2>Slingking® Hall of Fame</h2>
        <p>Join the ranks of esteemed celebrities who have earned their place in the prestigious Slingking® Hall of Fame. From national television to sold-out stadiums, Slingking has been making a splash on the national stage for over 35 years.</p>
        <div class="about-hof-tags">
          <span>Downtown Julie Brown</span>
          <span>Joan Rivers</span>
          <span>Pat Sajak</span>
          <span>David Letterman</span>
        </div>
        <p style="margin-top:1.25rem;">The list continues to grow — reflecting the widespread recognition and admiration for Slingking® and its exceptional products.</p>
      </div>
    </section>

    <section class="page-body page-body--alt">
      <div class="container">
        <div class="about-section-header">
          <span class="section-label">Trusted by the Pros</span>
          <h2 class="display-md">Used by Major Sports Teams</h2>
          <p>Slingking® provides sports venues with our slingshots for launching t-shirts into the crowd — taking sporting events to the next level and creating unforgettable moments.</p>
        </div>
        <div class="team-logos-wall">
          <img src="assets/Miami_Heat_logo.webp" alt="Miami Heat">
          <img src="assets/houston-rockets-logo-transparent.webp" alt="Houston Rockets">
          <img src="assets/Houston-Astros-Logo.svg" alt="Houston Astros">
          <img src="assets/Dayton_Dragons_logo.webp" alt="Dayton Dragons">
          <img src="assets/National_Hot_Rod_Association_Logo.webp" alt="NHRA" class="logo-nhra">
        </div>
        <p class="about-content-block" style="text-align:center;margin-top:1.5rem;">The Miami Heat, Houston Rockets, Houston Astros, Dayton Dragons, NHRA, and many more trust Slingking for crowd giveaways and stadium entertainment.</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container about-content-block">
        <h2>A History of Soakage</h2>
        <p>Water balloon launchers have become an integral part of outdoor play — from backyard parties and summer camps to beach days and campus events. Slingking helped lead that revolution with launchers built for incredible accuracy and distance, turning ordinary afternoons into legendary water wars.</p>
        <p>Over the decades, our product line has evolved from the original solo Launcher to the 3-man Water Balloon Cannon™ and the flagship Beast™ Mega Slingshot™ — each engineered with durable materials, improved performance, and the same patented Fill Anywhere™ system that started it all.</p>
        <p>Today, Slingking Water Balloon Launchers are a must-have for summer fun. We encourage safe, supervised play — see our <a href="safety-guidelines.html">safety guidelines</a> — and stand behind every kit with the best guarantee in the business.</p>
        <div class="about-cta-row">
          <a href="shop.html" class="btn btn-primary">Shop the Lineup</a>
          <a href="launcher.html" class="btn btn-secondary">Get the Original</a>
        </div>
      </div>
    </section>

    <section class="page-body page-body--alt">
      <div class="container">
        <div class="about-company-card">
          <h2 class="display-md" style="margin-bottom:0.75rem;">4D Innovations</h2>
          <p>925 S. Mason Rd #262<br>Katy, TX 77450</p>
          <div class="about-cta-row">
            <a href="contact.html" class="btn btn-water">Contact Us</a>
          </div>
        </div>
      </div>
    </section>`
  ),

  'contact.html': page(
    'contact.html',
    'Contact Us — Slingking®',
    'Contact Slingking® for orders, questions, and support. Send us a message and our team will help. Katy, TX.',
    `    <section class="page-hero page-hero--light">
      <div class="container">
        <span class="section-label">Get In Touch</span>
        <h1 class="display-lg">Contact Us</h1>
        <p>Questions about orders, bulk events, or product support? We're here to help.</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container">
        <div class="contact-grid">
          <form class="contact-form contact-card" action="mailto:info@slingking.com" method="post" enctype="text/plain">
            <h3>Send a Message</h3>
            <label>Name<input type="text" name="name" required></label>
            <label>Email<input type="email" name="email" required></label>
            <label>Topic
              <select name="topic">
                <option>Product Order</option>
                <option>Shipping Question</option>
                <option>Returns &amp; Guarantee</option>
                <option>General Inquiry</option>
              </select>
            </label>
            <label>Message<textarea name="message" required></textarea></label>
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </section>`,
    { lightHero: true }
  ),

  'safety-guidelines.html': page(
    'safety-guidelines.html',
    'Safety Guidelines — Slingking®',
    'Slingking water balloon launcher safety guidelines. Supervised use, safe distances, and responsible soakage.',
    `    <section class="page-hero page-hero--light">
      <div class="container">
        <span class="section-label">Support</span>
        <h1 class="display-lg">Safety Guidelines</h1>
        <p>Maximum fun starts with responsible use. Read before you launch.</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container prose">
        <p>Slingking® launchers are designed for supervised recreational water balloon battles. Follow these guidelines to keep every splash zone safe.</p>
        <h2>Supervision</h2>
        <ul>
          <li>Always have a responsible adult supervise launcher use, especially with children.</li>
          <li>Team launchers (Cannon and Beast) require coordinated crews — designate a safety captain.</li>
          <li>Never aim at faces, animals, or non-participants.</li>
        </ul>
        <h2>Launch Zones</h2>
        <ul>
          <li>Use in open outdoor areas with clear lines of sight.</li>
          <li>Establish a minimum safe distance between launchers and targets.</li>
          <li>Check behind your target zone for people, property, and vehicles before firing.</li>
          <li>Never launch toward roads, windows, or fragile property.</li>
        </ul>
        <h2>Equipment</h2>
        <ul>
          <li>Inspect tubing, pouches, and frames before each session.</li>
          <li>Use only Slingking® biodegradable balloons designed for your launcher.</li>
          <li>Do not modify launchers or remove safety components.</li>
        </ul>
        <h2>Participants</h2>
        <ul>
          <li>All participants should agree to battle rules before starting.</li>
          <li>Wear appropriate footwear on wet surfaces to prevent slips.</li>
          <li>Stop immediately if anyone is injured or equipment fails.</li>
        </ul>
        <p>Questions? Contact <a href="mailto:info@slingking.com">info@slingking.com</a> or visit our <a href="contact.html">contact page</a>.</p>
      </div>
    </section>`,
    { lightHero: true }
  ),

  'shipping-info.html': page(
    'shipping-info.html',
    'Shipping Info — Slingking®',
    'Slingking shipping information. Free shipping on orders over $50. Katy, TX fulfillment.',
    `    <section class="page-hero page-hero--light">
      <div class="container">
        <span class="section-label">Support</span>
        <h1 class="display-lg">Shipping Info</h1>
        <p>Get your launcher battle-ready. Here's how we ship.</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container prose">
        <h2>Free Shipping</h2>
        <p>Enjoy <strong>free shipping on orders over $50</strong>. Most complete launcher kits qualify automatically.</p>
        <h2>Processing Time</h2>
        <p>Orders are typically processed within 1–3 business days. You'll receive confirmation when your order ships.</p>
        <h2>Delivery</h2>
        <ul>
          <li>Standard shipping via major carriers to continental U.S. addresses.</li>
          <li>Delivery times vary by location — generally 3–7 business days after shipment.</li>
          <li>Tracking information is provided when available.</li>
        </ul>
        <h2>How to Order</h2>
        <p>Add your launchers and accessories to the cart and check out securely online. Your order total, including any applicable shipping, is calculated at checkout before you pay.</p>
        <p>Need help? <a href="contact.html">Contact us</a>.</p>
      </div>
    </section>`,
    { lightHero: true }
  ),

  'returns-guarantee.html': page(
    'returns-guarantee.html',
    'Returns &amp; Guarantee — Slingking®',
    'Slingking returns and guarantee policy. The best guarantee in the business.',
    `    <section class="page-hero page-hero--light">
      <div class="container">
        <span class="section-label">Support</span>
        <h1 class="display-lg">Returns &amp; Guarantee</h1>
        <p>The best guarantee in the business — we stand behind every launcher.</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container prose">
        <h2>Our Guarantee</h2>
        <p>Slingking® is built to last. We stand behind our patented design and quality craftsmanship. If your launcher doesn't meet expectations due to a defect or workmanship issue, we'll make it right.</p>
        <h2>Returns</h2>
        <ul>
          <li>Request a return within 30 days of delivery.</li>
          <li>Items must be in original condition with all included components.</li>
          <li>Return shipping may apply unless the return is due to our error or a defective product.</li>
        </ul>
        <h2>How to Start a Return</h2>
        <ol>
          <li>Open the confirmation email from your order and select <strong>Return items</strong> to start your request online.</li>
          <li>Choose the items you'd like to return and submit your request for review.</li>
          <li>Once approved, you'll receive return instructions and a prepaid shipping label where applicable.</li>
          <li>Your refund is issued to the original payment method after we receive and inspect the item.</li>
        </ol>
        <h2>Damaged or Defective Items</h2>
        <p>If your order arrives damaged or has a defect, start a return through your order confirmation email — or <a href="contact.html">contact us</a> with a few photos of the issue — and we'll make it right.</p>
        <p><a href="contact.html">Contact us</a> with any questions.</p>
      </div>
    </section>`,
    { lightHero: true }
  ),

  'terms-of-service.html': page(
    'terms-of-service.html',
    'Terms of Service — Slingking®',
    'Slingking terms of service for slingking.com and product purchases.',
    `    <section class="page-hero page-hero--light">
      <div class="container">
        <span class="section-label">Legal</span>
        <h1 class="display-lg">Terms of Service</h1>
        <p>Last updated: June 2026</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container prose">
        <p>Welcome to Slingking®. By using this website and purchasing our products, you agree to these Terms of Service operated by TKO Inc. / 4D Innovations ("we," "us," or "our").</p>
        <h2>Use of Website</h2>
        <p>You may use this site for lawful purposes related to learning about and purchasing Slingking products. You agree not to misuse the site or interfere with its operation.</p>
        <h2>Products &amp; Orders</h2>
        <p>Product descriptions, images, and pricing are subject to change. Orders placed via email are confirmed by our team. We reserve the right to refuse or cancel orders at our discretion.</p>
        <h2>Intellectual Property</h2>
        <p>Slingking®, Fill Anywhere™, and related marks, product names, and content on this site are owned by TKO Inc. / 4D Innovations. Unauthorized use is prohibited.</p>
        <h2>Limitation of Liability</h2>
        <p>Our products are intended for supervised recreational use. We are not liable for injury or damage resulting from misuse or failure to follow <a href="safety-guidelines.html">safety guidelines</a>. To the fullest extent permitted by law, our liability is limited to the purchase price of the product.</p>
        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of the State of Texas.</p>
        <h2>Contact</h2>
        <p>Questions about these terms? <a href="contact.html">Contact us</a> at <a href="mailto:info@slingking.com">info@slingking.com</a>.</p>
      </div>
    </section>`
  ),

  'privacy-policy.html': page(
    'privacy-policy.html',
    'Privacy Policy — Slingking®',
    'Slingking privacy policy — how we collect and use your information.',
    `    <section class="page-hero page-hero--light">
      <div class="container">
        <span class="section-label">Legal</span>
        <h1 class="display-lg">Privacy Policy</h1>
        <p>Last updated: June 2026</p>
      </div>
    </section>

    <section class="page-body">
      <div class="container prose">
        <p>TKO Inc. / 4D Innovations ("Slingking," "we," "us") respects your privacy. This policy describes how we collect, use, and protect information when you visit slingking.com or contact us.</p>
        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Contact information</strong> — name and email when you subscribe to updates, contact us, or place an order.</li>
          <li><strong>Order details</strong> — products requested and shipping information you provide.</li>
          <li><strong>Usage data</strong> — basic analytics about how visitors use our website (pages viewed, browser type).</li>
        </ul>
        <h2>How We Use Information</h2>
        <ul>
          <li>Process and fulfill orders</li>
          <li>Respond to support requests</li>
          <li>Send newsletters and promotional offers (with your consent)</li>
          <li>Improve our website and products</li>
        </ul>
        <h2>Sharing</h2>
        <p>We do not sell your personal information. We may share data with service providers who help us operate our business (e.g., shipping carriers, email services) under confidentiality agreements.</p>
        <h2>Cookies</h2>
        <p>Our site may use cookies and similar technologies for basic functionality and analytics. You can control cookies through your browser settings.</p>
        <h2>Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal information by contacting <a href="mailto:info@slingking.com">info@slingking.com</a>.</p>
        <h2>Contact</h2>
        <p>Privacy questions? <a href="contact.html">Contact us</a> or email <a href="mailto:info@slingking.com">info@slingking.com</a>.</p>
      </div>
    </section>`,
    { lightHero: true }
  ),
};

Object.entries(pages).forEach(([file, html]) => {
  fs.writeFileSync(path.join(root, file), html, 'utf8');
  console.log('Wrote', file);
});
