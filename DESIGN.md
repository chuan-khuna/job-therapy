# Design System — Job Therapy

> See `DESIGN.html` for a rendered preview of all tokens and components.

## Philosophy

The app should feel like a well-worn journal sitting on a wooden desk — tactile, honest, slightly imperfect. Not clinical. Not a SaaS dashboard. The user is doing something vulnerable (assessing their work life), so the environment should be warm and unhurried.

**Neobrutalism, but restrained.** Visible borders, flat shadows, and a limited palette — but no neon, no jarring offsets. Think notebook stickers, not brutalist posters. Borders are intentionally low-contrast (muted sage) so they whisper structure rather than shout it.

## Theme: `warm-paper`

Applied via `data-theme="warm-paper"` on `<html>`.
File: `styles/presets/warm-paper.css`

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `oklch(97% 0.015 88)` | Page background (warm off-white) |
| `--color-surface` | `oklch(94% 0.014 100)` | Card / panel background |
| `--color-surface-raised` | `oklch(99% 0.008 90)` | Elevated surfaces (modals) |
| `--color-border` | `oklch(72% 0.022 112)` | Muted warm sage border — low contrast |
| `--color-text` | `oklch(22% 0.018 100)` | Body text |
| `--color-text-muted` | `oklch(54% 0.020 115)` | Secondary / helper text |
| `--color-accent` | `oklch(52% 0.10 142)` | Matcha — muted green, interactive highlight |
| `--color-accent-hover` | `oklch(46% 0.10 142)` | Accent on hover |
| `--color-accent-fg` | `oklch(98% 0.006 90)` | Text on accent backgrounds |
| `--color-ink` | `oklch(20% 0.020 100)` | Headings, emphasis |
| `--color-shadow` | `oklch(72% 0.022 112)` | Box-shadow color (matches border) |

### Typography

- **Heading font**: serif (system `Georgia` or a loaded serif) — warm, editorial
- **Body font**: `ui-sans-serif, system-ui` — legible, neutral
- **Mono font**: `ui-monospace` — for scores and data
- Base size: `1rem` / `16px`
- Line height: `1.6` for body, `1.2` for headings

### Spacing

4px base unit. Use Tailwind spacing scale (`p-2` = 8px, `p-4` = 16px, etc.).

### Borders & shadows

- Border width: `2px` solid, color `var(--color-border)`
- Border radius: `4px` (slightly rounded — not sharp, not pill)
- Box shadow: `3px 3px 0px var(--color-shadow)` — flat offset, no blur
- On hover (interactive cards): shadow shifts to `4px 4px 0px var(--color-shadow)`

### Components

#### Card

```
border: 2px solid var(--color-border)
background: var(--color-surface)
box-shadow: 3px 3px 0px var(--color-shadow)
border-radius: 4px
padding: 1.25rem 1.5rem
```

#### Button (primary)

```
background: var(--color-accent)
color: var(--color-accent-fg)
border: 2px solid var(--color-border)
box-shadow: 3px 3px 0px var(--color-shadow)
border-radius: 4px
font-weight: 600
padding: 0.5rem 1.25rem
transition: box-shadow 80ms, transform 80ms

:hover → box-shadow: 1px 1px 0px; transform: translate(2px, 2px)
:active → box-shadow: none; transform: translate(3px, 3px)
```

#### Button (ghost)

```
background: transparent
color: var(--color-text)
border: 2px solid var(--color-border)
box-shadow: 3px 3px 0px var(--color-shadow)
(same hover/active as primary)
```

#### Input / Select

```
border: 2px solid var(--color-border)
border-radius: 4px
background: var(--color-surface-raised)
padding: 0.5rem 0.75rem
:focus → outline: 2px solid var(--color-accent); outline-offset: 2px
```

#### Progress / score bar

Flat filled bar, no rounded ends. Height `12px`. Fill color: `var(--color-accent)`.

## Texture

The paper feel comes from color alone (warm off-whites) — do not add background image textures or patterns. Keep the DOM clean.

## Iconography

Line icons only. Stroke width 2px. Lucide or similar. Never filled icons.

## Motion

Minimal. Transitions only for interactive feedback (button press, focus rings). No page transitions, no floating animations. Duration ≤ 150ms.
