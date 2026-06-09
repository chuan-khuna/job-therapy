---
status: accepted
---

# Mood Log: an Entry holds many Emotions, and the Emotion occurrence is the counted unit

## Decision

In the Mood Log feature, the journal record is an **Entry** — one optional written
note plus **one or more Emotion tags** drawn from Plutchik's 24-petal wheel. The
atomic thing the month grid and daily breakdown count is the **Emotion occurrence**,
not the Entry. Logging "ประชุมแล้วโดน feedback แรง" with Anger + Sadness + Fear is
**one** Entry that contributes **three** occurrences to that day's totals.

## Context

The grid must answer "วันนั้นแต่ละอารมณ์ถูก log ไปกี่ครั้ง" — a per-emotion count
per day. Two shapes produce counts:

- **Entry has many Emotions** (chosen) — text and feelings stay bound together, so a
  moment with mixed feelings is one journal record. Matches the intended flow: add an
  item, then attach emotions to it.
- **Each Emotion is its own log** (rejected) — simpler row, but a single moment's
  feelings can't share one note; the journal fragments into per-emotion rows.

## Why this is recorded

The choice fixes the backend table relationship (an Entry row with a collection of
Emotion tags, each carrying Family + Intensity), so it is **hard to reverse** once
data exists. A reader seeing the grid count occurrences rather than entries would
reasonably wonder why one journal record can move the totals by three — this records
that it is deliberate.

## Consequences

- The grid/breakdown aggregate **occurrences grouped by Emotion Family**; Intensity is
  a sub-detail within a Family, not a separate countable bucket.
- An Entry with no Emotions is not meaningful for the grid — at least one tag is
  expected per Entry.
- See [CONTEXT.md](../../CONTEXT.md) for the canonical terms (Entry, Emotion, Emotion
  Family, Intensity, Dominant Emotion).
