# Job Therapy — Context

A digital self-assessment tool for surfacing workplace misalignment. This glossary
defines the project's domain language. It is a glossary, not a spec — no
implementation details.

## Mood Log

**Entry**:
A single journal record the user creates at a moment in time, holding an optional
written note and one or more Emotion tags. The user can add an Entry at any time
during the day.
_Avoid_: item, log, post, record

**Emotion**:
A feeling drawn from Plutchik's wheel, attached to an Entry as a tag. One Entry
carries one or more Emotions. An Emotion is one of 24 petals — an Emotion Family
at a given Intensity. The Emotion occurrence is the unit counted in the month
grid ("how many times each emotion was logged that day").
_Avoid_: mood, feeling, tag

**Emotion Family**:
One of Plutchik's eight primary emotions: Joy, Trust, Fear, Surprise, Sadness,
Disgust, Anger, Anticipation. Each Family owns a colour and three Intensity
petals. The month grid and daily breakdown group by Family; Intensity is a
sub-detail within it.
_Avoid_: primary emotion, category

**Intensity**:
One of three strengths a Family can be logged at — mild, base, or strong (e.g.
Annoyance < Anger < Rage for the Anger Family). It refines an Emotion but does
not change which Family it belongs to.

**Dominant Emotion**:
The Emotion Family with the most occurrences on a given day. It determines that
day's grid cell colour; ties break by Plutchik wheel order (Joy first).

**Mood Log**:
The whole feature: the daily journal of Entries plus the month grid that
visualises Emotion activity over time.
