# pensive ronin

Portfolio site for my photo and video edits. Plain HTML, CSS and JavaScript, so there is no build step.

## Files

- `index.html`: page structure and content
- `style.css`: colors, fonts and animations (change the theme in `:root` at the top)
- `script.js`: cursor, scroll effects, mobile menu and lightbox
- `assets/`: put your photos and videos here

## Adding your work

Put an image in `assets/`, then in `index.html` replace a placeholder `<svg class="tsv">…</svg>` with:

```html
<img src="assets/your-image.jpg" class="port-thumb" alt="title">
```

For a background video, add this as the first thing inside `<section class="hero">`:

```html
<video class="hero-video" autoplay muted loop playsinline>
  <source src="assets/your-video.webm" type="video/webm">
</video>
```

## Viewing it

Open `index.html` in a browser, or turn on GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/root`) to put it online.
