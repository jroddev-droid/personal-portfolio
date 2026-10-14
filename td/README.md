# TouchDesigner source for the hero loop

- `pensive_cyber_tree.glsl`: pixel shader for the GLSL TOP `grade`. It grades the source clip to ink black and draws the cyber cherry tree (chrome mesh branches, neon shard petals). Uniforms: `uTime`, `uPeriod` (8.0), `uRes`, `uBloom` (tree strength, 1.0), `uPetal` (petal colour, default 1.0, 0.36, 0.72 — set to ~0.86, 0.88, 0.95 for silver).
- `render_ctrl.py`: renders the 8-second loop to PNG frames.

Network (in `/project1/pensive_bg`): `src_a` + `src_b` (Movie File In, same clip, offset 240 frames) → `loop_seam` (Cross) → `grade` (GLSL, 1920×1080, rgba16float) → `bloom_blur` (Blur, 28) → `bloom_level` (Level, opacity 0.3) → `bloom_add` (Composite, add) → `final` (Null).

Rendered output in this branch: `assets/hero-loop.webm`, `assets/hero-loop.mp4`, `assets/hero-poster.jpg`.
