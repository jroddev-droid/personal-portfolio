# pensive ronin

Portfolio site for my photo and video edits. Plain HTML, CSS and JavaScript, so there is no build step.

## Files

- `index.html`: page structure and content
- `style.css`: colors, fonts and animations (change the theme in `:root` at the top)
- `script.js`: cursor, scroll effects and mobile menu
- `archive.js`: the Archive list and the canvas + viewer that display it
- `assets/`: put your photos and videos here

## Adding your work

The Archive (the "work" section) is an endless, draggable canvas. Everything in it comes from the `ARCHIVE` list at the top of `archive.js`.

1. Put the file in `assets/archive/`: full-size images in `full/`, short muted `.mp4` loops in `video/`, and (optional, but faster) ~640px-wide copies in `thumbs/`.
2. Add a line to `ARCHIVE`:

```js
{ src: 'assets/archive/full/name.jpg', thumb: 'assets/archive/thumbs/name.jpg', title: 'name', tag: 'photo edit' },
{ video: 'assets/archive/video/name.mp4', thumb: 'assets/archive/thumbs/name.jpg', title: 'name', tag: 'video edit' },
```

The canvas works out each frame's shape and scatters them on its own. The order of the list is the order in the viewer.

The hero background video is `assets/cynthwave-bg.webm` / `.mp4`.

## Viewing it

Open `index.html` in a browser, or turn on GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/root`) to put it online.
