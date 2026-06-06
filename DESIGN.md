# Design System — Job Therapy

> See `DESIGN.html` for a rendered preview of all tokens and components.

## Philosophy

The app should feel like a well-worn journal sitting on a wooden desk — calm, warm, unhurried. Not clinical. Not a SaaS dashboard. The user is doing something vulnerable (assessing their work life), so the environment should feel safe and soft.

**Clean and editorial.** Generous whitespace, soft shadows, and a restrained palette. Think the inside of a good notebook — not the cover. Borders carry a whisper of matcha green (not warm gray), surfaces breathe with washi warmth, and the muted yabukita accent shows up only where it matters.

## Theme: `warm-paper`

Applied via `data-theme="warm-paper"` on `<html>`.
File: `styles/presets/warm-paper.css`

### Color tokens

| Token | Value | Named stop | Use |
|---|---|---|---|
| `--color-bg` | `oklch(97% 0.016 88)` | 和紙 washi | Page background — warm parchment |
| `--color-surface` | `oklch(99% 0.008 88)` | — | Card / panel background — near-white |
| `--color-surface-raised` | `oklch(100% 0 0)` | 白 shiro | Elevated surfaces — white |
| `--color-border` | `oklch(89% 0.018 142)` | 露光り hint | Matcha-tinted border — barely green |
| `--color-border-strong` | `oklch(80% 0.038 148)` | 露光り tsuyuhikari | Stronger border on hover / emphasis |
| `--color-text` | `oklch(22% 0.016 80)` | — | Body text — warm near-black |
| `--color-text-muted` | `oklch(56% 0.014 84)` | — | Secondary / helper text |
| `--color-ink` | `oklch(15% 0.016 80)` | — | Headings, emphasis — darkest |
| `--color-accent` | `oklch(54% 0.125 148)` | やぶきた yabukita (muted) | Primary matcha — C pulled to 0.125 |
| `--color-accent-hover` | `oklch(46% 0.112 148)` | 奥みどり okumidori (muted) | Accent on hover (deepened) |
| `--color-accent-subtle` | `oklch(93% 0.028 150)` | 煎茶 sencha (muted) | Tinted matcha background (selected states) |
| `--color-accent-fg` | `oklch(99% 0.005 88)` | 白 shiro warm | Text on accent — warm white |
| `--color-destructive` | `oklch(60% 0.13 38)` | — | Terracotta — warm delete / error |
| `--color-destructive-hover` | `oklch(54% 0.13 38)` | — | Destructive on hover |
| `--color-destructive-subtle` | `oklch(94% 0.025 38)` | — | Tinted terracotta background (selected "no" states) |
| `--color-destructive-fg` | `oklch(99% 0.005 38)` | — | Text on destructive |

**Accent rationale:** やぶきた yabukita (H148) at C=0.125 — the full matcha scale runs C=0.170–0.178 at the vivid stops; pulling back to 0.125 keeps the green legible but unhurried. **Borders use H142** (tsuyuhikari range), giving card edges and dividers a barely-perceptible green cast that reinforces the tea palette without being visible at a glance. Use `--color-accent-subtle` (sencha-range, muted) for selected / hover fill states.

**Named matcha scale** (for extending the system — do not use raw values in components; extend the token list instead):

| Stop | OKLCH | Character |
|---|---|---|
| 白茶 shiracha | `96% 0.025 148` | tints |
| 煎茶 sencha | `93% 0.042 150` | hover fills |
| 抹茶ラテ latte | `89% 0.065 151` | softest green |
| 露光り tsuyuhikari | `81% 0.105 152` | light mid → border-strong |
| 五月みどり samidori | `72% 0.145 151` | mid |
| 旭 asahi | `63% 0.170 150` | interactive (full vivid) |
| **やぶきた yabukita** | **`54% 0.125 148`** | **primary — muted here** |
| 奥みどり okumidori | `45% 0.158 148` | emphasis |
| 薄茶 usucha | `37% 0.128 150` | dark accent |
| 濃茶 koicha | `21% 0.065 154` | near-black ink |

### Typography

- **Heading font**: `Bai Jamjuree` (`--font-serif` slot, via `next/font`) — warm, editorial, always roman (`font-style: normal`)
- **Body font**: `Noto Sans Thai Looped` (`--font-sans`, via `next/font`) — legible, neutral
- **Mono font**: `ui-monospace` — for scores and data
- Base size: `1rem` / `16px`
- Line height: `1.65` for body, `1.25` for headings
- h1 weight: `700`

### Spacing

4px base unit. Use Tailwind spacing scale (`p-2` = 8px, `p-4` = 16px, etc.).

### Borders & shadows

- Border: `1px` or `1.5px` solid, color `var(--color-border)` — H142, barely-green tint
- Border radius: `12px` for cards / panels, `8px` for option buttons, `6px` for inputs and buttons, `100px` for badges and progress bars
- Card shadow: `0 1px 2px oklch(20% 0.015 80 / 0.04), 0 4px 16px oklch(20% 0.015 80 / 0.06)` — layered soft shadow
- Question card shadow: `0 1px 2px oklch(20% 0.015 80 / 0.04), 0 6px 20px oklch(20% 0.015 80 / 0.07)`
- Button shadow (primary): `0 1px 3px oklch(54% 0.125 148 / 0.30)` — tinted, not neutral
- Focus ring: `box-shadow: 0 0 0 3px oklch(54% 0.125 148 / 0.12)` + border-color change
- Progress bar track: `oklch(89% 0.022 142)` — matcha-tinted track, not neutral gray
- Hover (interactive): border-color strengthens; no transform-shift (not neobrutalist)

### Components

#### Card

```
background: var(--color-surface)
border: 1px solid var(--color-border)
border-radius: 12px
box-shadow: 0 1px 2px oklch(20% 0.015 80 / 0.04), 0 4px 16px oklch(20% 0.015 80 / 0.06)
padding: 1.25rem 1.5rem
```

#### Button (primary)

```
background: var(--color-accent)
color: var(--color-accent-fg)
border: none
border-radius: 6px
font-weight: 500
padding: 0.5rem 1.2rem
box-shadow: 0 1px 3px oklch(55% 0.14 148 / 0.35)
transition: background 120ms, box-shadow 120ms, transform 80ms

:hover → background: var(--color-accent-hover); box-shadow intensifies
:active → transform: scale(0.98)
:focus-visible → outline: 2px solid var(--color-accent); outline-offset: 3px
```

#### Button (ghost)

```
background: var(--color-surface-raised)
color: var(--color-text)
border: 1px solid var(--color-border)
border-radius: 6px
box-shadow: 0 1px 2px oklch(20% 0.015 80 / 0.06)
:hover → border-color: var(--color-border-strong); background: var(--color-surface)
```

#### Input / Select / Textarea

```
border: 1.5px solid var(--color-border)
border-radius: 6px
background: var(--color-surface-raised)
padding: 0.5rem 0.75rem
:focus → border-color: var(--color-accent); box-shadow: 0 0 0 3px oklch(55% 0.14 148 / 0.15)
textarea: resize: vertical; min-height: 90px
```

#### Progress / score bar

Pill-shaped (border-radius: 100px). Height 8px. Fill color: `var(--color-accent)`. No border.

#### Badge / Tag

```
border-radius: 100px
background: var(--color-border)
color: var(--color-text-muted)
font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase
padding: 0.2rem 0.6rem
No border, no shadow.

Variants: badge-accent (accent-subtle bg + accent text), badge-ink (dark fill)
```

#### Option button (quiz)

```
background: var(--color-surface-raised)
border: 1.5px solid var(--color-border)
border-radius: 8px
:hover → border-color: var(--color-accent); background: var(--color-surface); 
          box-shadow: 0 0 0 3px oklch(55% 0.14 148 / 0.08)
.selected → background: var(--color-accent-subtle); border-color: var(--color-accent)
```

## Texture

The paper feel comes from warm parchment surface colors — no background image textures or patterns. Keep the DOM clean.

## Iconography

Line icons only. Stroke width 2px. Lucide or similar. Never filled icons.

## Motion

Minimal. `background`, `border-color`, and `box-shadow` transitions at 120ms. Scale on `:active` at 80ms. No page transitions, no floating animations. Always support `prefers-reduced-motion: reduce`.
