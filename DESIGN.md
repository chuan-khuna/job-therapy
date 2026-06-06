# Design System — Job Therapy

> See `DESIGN.html` for a rendered preview of all tokens and components.

## Philosophy

The app should feel like a well-worn journal sitting on a wooden desk — tactile, honest, slightly imperfect. Not clinical. Not a SaaS dashboard. The user is doing something vulnerable (assessing their work life), so the environment should be warm and unhurried.

**Neobrutalism, but restrained.** Visible borders, flat shadows, and a limited palette — but no neon, no jarring offsets. Think notebook cover, not brutalist poster. Borders are kraft-brown so they whisper paper rather than shout structure.

## Theme: `warm-paper`

Applied via `data-theme="warm-paper"` on `<html>`.
File: `styles/presets/warm-paper.css`

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `oklch(96% 0.018 82)` | Page background — warm parchment |
| `--color-surface` | `oklch(93% 0.016 88)` | Card / panel background — warm paper |
| `--color-surface-raised` | `oklch(98% 0.010 85)` | Elevated surfaces — cream white |
| `--color-border` | `oklch(70% 0.030 74)` | Kraft brown border — warm, paper-like |
| `--color-shadow` | `oklch(56% 0.032 74)` | Box-shadow — darker than border for depth |
| `--color-text` | `oklch(20% 0.022 74)` | Body text — warm dark ink |
| `--color-text-muted` | `oklch(52% 0.020 84)` | Secondary / helper text |
| `--color-ink` | `oklch(16% 0.022 74)` | Headings, emphasis — darkest ink |
| `--color-accent` | `oklch(66% 0.10 68)` | Amber — muted warm highlight |
| `--color-accent-hover` | `oklch(58% 0.10 68)` | Accent on hover (darkened) |
| `--color-accent-fg` | `oklch(14% 0.020 74)` | Text on accent — dark ink |
| `--color-destructive` | `oklch(60% 0.13 38)` | Terracotta — warm delete / error |
| `--color-destructive-hover` | `oklch(54% 0.13 38)` | Destructive on hover |
| `--color-destructive-fg` | `oklch(14% 0.020 74)` | Text on destructive |

**Accent rationale:** Amber (H68) instead of teal reads warmer and more paper-adjacent — the colour of old notebooks, tea, worn leather. Shadow is intentionally darker than border (`56%` vs `70%` lightness) so the flat offset reads clearly even at small sizes.

### Typography

- **Heading font**: serif (system `Georgia` or a loaded serif) — warm, editorial, always roman (`font-style: normal`)
- **Body font**: `ui-sans-serif, system-ui` — legible, neutral
- **Mono font**: `ui-monospace` — for scores and data
- Base size: `1rem` / `16px`
- Line height: `1.6` for body, `1.2` for headings
- h1 weight: `700` (bold serif reads warmer than regular)

### Spacing

4px base unit. Use Tailwind spacing scale (`p-2` = 8px, `p-4` = 16px, etc.).

### Borders & shadows

- Border width: `2px` solid, color `var(--color-border)`
- Border radius: `4px` — slightly rounded, not sharp, not pill
- Box shadow (cards): `4px 4px 0px var(--color-shadow)` — flat offset, no blur
- Box shadow (buttons, option-btns): `3px 3px 0px var(--color-shadow)`
- Box shadow (badges): `2px 2px 0px var(--color-shadow)`
- On hover (interactive): shadow shifts to `1px 1px`, translate `(2px, 2px)` — press-in feel

### Components

#### Card

```
border: 2px solid var(--color-border)
background: var(--color-surface)
box-shadow: 4px 4px 0px var(--color-shadow)
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
:focus-visible → outline: 2px solid var(--color-accent); outline-offset: 2px
```

#### Button (ghost)

```
background: transparent
color: var(--color-text)
border: 2px solid var(--color-border)
box-shadow: 3px 3px 0px var(--color-shadow)
:hover → background: var(--color-surface)
(same press as primary)
```

#### Input / Select / Textarea

```
border: 2px solid var(--color-border)
border-radius: 4px
background: var(--color-surface-raised)
padding: 0.5rem 0.75rem
:focus → outline: 2px solid var(--color-accent); outline-offset: 2px
textarea: resize: vertical; min-height: 90px
```

#### Progress / score bar

Flat filled bar, no rounded ends. Height `12px`. Fill color: `var(--color-accent)`.

#### Badge / Tag

```
border: 2px solid var(--color-border)
border-radius: 2px
background: var(--color-surface-raised)
color: var(--color-text-muted)
font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase
padding: 0.2rem 0.55rem
box-shadow: 2px 2px 0px var(--color-shadow)

Variants: badge-accent (amber fill), badge-ink (dark fill)
```

## Texture

The paper feel comes from color alone (warm parchment tones, kraft borders) — do not add background image textures or patterns. Keep the DOM clean.

## Iconography

Line icons only. Stroke width 2px. Lucide or similar. Never filled icons.

## Motion

Minimal. Transitions only for interactive feedback (button press, focus rings). No page transitions, no floating animations. Duration ≤ 150ms. Always support `prefers-reduced-motion: reduce`.
