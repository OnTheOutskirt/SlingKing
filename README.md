# Slingking® Website

Marketing and storefront website for **Slingking®** water balloon launchers — the original water balloon slingshot since 1988.

This is a static, multi-page HTML/CSS/JS site (a rebuild reference for the Shopify storefront).

## Structure

```
index.html              Homepage
shop.html               Shop / all products
launcher.html           Product: Water Balloon Launcher™
cannon.html             Product: Water Balloon Cannon™
beast.html              Product: Beast™ Mega Slingshot™
bomber-pack.html        Accessory: Bomber-Pack™
beast-pack.html         Accessory: Beast-Pack™
targets.html            Accessory: Water Balloon Targets™
accessories.html        Accessories listing
about.html              About page
contact.html            Contact page
*-policy / *-guide      Support & legal pages
css/styles.css          Design system & all styles
js/main.js              Cart, promo popup, hero slideshow, video, interactions
partials/               Shared HTML snippets (cart sidebar, promo popup)
assets/                 Images (WebP) and video
tools/                  Build / asset scripts
```

## Local development

It's a static site — open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Build scripts

Product, accessory, about, and support pages are generated from templates:

```bash
node tools/generate-pages.js      # regenerate HTML pages
node tools/convert-to-webp.js     # convert source PNGs in assets/ to sized WebP
node tools/update-asset-refs.js   # rewrite .png references to .webp
```

> Note: `index.html` is edited directly (not generated). Re-run `generate-pages.js`
> after changing the templates inside `tools/generate-pages.js`.

## Assets

All site images are optimized **WebP** (converted from source PNGs, ~95% smaller).
The homepage field-footage video is an MP4 in `assets/`.
