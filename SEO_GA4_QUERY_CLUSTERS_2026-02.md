# GA4 SEO Query Clusters (Google Organic)

Source report: `/Users/neodelf/Downloads/Запросы_Поисковый_запрос_при_обычном_поиске_Google.csv`  
Period: `2026-01-14` to `2026-02-10`

## 1) Brand-like queries

Main variants around `world of solitaire` and close permutations:
- `world of solitaire` (229 impressions, avg pos 72.47)
- `world solitaire` (47 impressions, avg pos 52.79)
- `solitaire world` (37 impressions, avg pos 67.24)
- `solitaire world of solitaire` (33 impressions, avg pos 69.39)
- `world solitaire game` (28 impressions, avg pos 66.68)
- `world soli` (20 impressions, avg pos 5.65, 0 clicks)

Observation:
- Highest impression bucket but very weak CTR overall.
- Strong signal that snippets/titles need higher relevance to "play now" intent, not only brand wording.

## 2) Play-now intent queries

Queries with game-start intent:
- `world of solitaire oyna` (24 clicks, 159 impressions, CTR 15.09%, avg pos 3.21)
- `world solitaire oyna` (19 clicks, 141 impressions, CTR 13.48%, avg pos 4.48)
- `play world of solitaire` (4 impressions, avg pos 75, 0 clicks)
- `play solitaire online full screen` (1 impression, avg pos 83, 0 clicks)
- `free world of solitaire` / `world solitaire free` / `world of solitaire free online`

Observation:
- Turkish "oyna" terms already convert relative to rank.
- This validates expanding EN/TR metadata and internal anchors for `play`, `free`, `fullscreen`, `no ads`.

## 3) Informational queries

Rules/strategy/how-to intent:
- `how to play klondike` (2 impressions, avg pos 69.5)
- `klondike solitaire rules` (2 impressions, avg pos 103.5)
- `solitaire klondike rules` (2 impressions, avg pos 83)
- `klondike strategy` (1 impression, avg pos 84)
- `solitaire strategy` (1 impression, avg pos 28)

Observation:
- Low impression but clear content opportunity.
- Priority: strengthen article structure with query-shaped headings + FAQ + CTA to game.

## 4) Misspellings and typo traffic

Typo examples:
- `word of solitaire`, `w0rld of solitaire`, `world 0f solitaire`
- `world of solitair`, `world of solitare`, `worldofsoltaire`
- `wsolitare`, `solitare world`, `worlofsolitaire`

Observation:
- Non-trivial long-tail typo demand exists.
- Avoid thin typo pages; cover variants naturally in robust pages and metadata.

## Baseline KPIs (from this export)

- Total clicks: 55
- Total impressions: 900
- Overall CTR: 6.11%
- Weighted avg position: 50.30

## Measurement cadence

- Re-export same GA4/Search Console report every 14 days.
- Compare by query clusters:
  - clicks
  - impressions
  - CTR
  - avg position
- Prioritize improvements in:
  - TR and EN home pages
  - `/en/solitaire-strategy/`, `/en/klondike-rules/`, `/en/how-to-play-solitaire/`
  - `/tr/solitaire-strategy/`, `/tr/klondike-rules/`, `/tr/how-to-play-solitaire/`
