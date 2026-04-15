# SEO Measurement Baseline (14-day cadence)

Baseline source: `/Users/neodelf/Downloads/Запросы_Поисковый_запрос_при_обычном_поиске_Google.csv`  
Baseline period: `2026-01-14` to `2026-02-10`

## Baseline metrics

- Total clicks: `55`
- Total impressions: `900`
- Overall CTR: `6.11%`
- Avg position (weighted): `50.30`

## Cluster-level baseline

### Brand-like
- Main group around `world of solitaire` variations and close permutations.
- Target: increase CTR with stronger play-intent snippets.

### Play-now intent
- Includes `oyna`, `play`, `free`, `fullscreen`.
- Target: defend and scale high-converting TR/EN terms.

### Informational intent
- Includes `how to play klondike`, `klondike solitaire rules`, `solitaire strategy`.
- Target: improve position via expanded content + FAQ + internal links.

### Typos/misspellings
- Includes `world of solitair`, `word of solitaire`, `w0rld of solitaire`, etc.
- Target: capture via strong core pages, not thin typo pages.

## 14-day reporting loop

1. Export the same GA4/Search Console query report every 14 days.
2. Compare against baseline by:
   - clicks
   - impressions
   - CTR
   - avg position
3. Record results for key pages:
   - `/`
   - `/tr/`
   - `/en/how-to-play-solitaire/`
   - `/en/klondike-rules/`
   - `/en/solitaire-strategy/`
   - `/tr/how-to-play-solitaire/`
   - `/tr/klondike-rules/`
   - `/tr/solitaire-strategy/`
4. If any cluster grows in impressions but not clicks, rewrite title/description first.
5. After major releases, run [SEO_TECH_CHECKLIST.md](SEO_TECH_CHECKLIST.md) (indexing, canonical, CWV).

## Comparison table template

| Check date | Clicks | Impressions | CTR | Avg position | Notes |
|---|---:|---:|---:|---:|---|
| 2026-02-10 (baseline) | 55 | 900 | 6.11% | 50.30 | Baseline after initial SEO rollout |
| 2026-02-24 |  |  |  |  |  |
| 2026-03-10 |  |  |  |  |  |
| 2026-03-20 | *GSC* | 2006 | *GSC* | *GSC* (49.68 GA4-weighted) | GA4 export `…Google_21_03_26.csv`: **0 clicks on every row** — do not use for CTR; see [SEO_ATTRIBUTION_VALIDATION.md](SEO_ATTRIBUTION_VALIDATION.md). Normalized data: [data/ga4_organic_queries_20260221_20260320.csv](data/ga4_organic_queries_20260221_20260320.csv). Totals (verified): `python3 scripts/sum_ga4_organic_export.py` → clicks `0`, impressions `2006`, weighted_avg_position `49.68`. Replace *GSC* with Search Console values when available. |

Period for the 2026-03-20 row: **2026-02-21 — 2026-03-20** (28 days; not directly comparable to the 27-day baseline window — prefer same-length windows next time).

## 14-day checkpoint for CTR updates (added 2026-03-26)

Update window start: `2026-03-26`  
Checkpoint date (+14 days): `2026-04-09`

### What changed in this release

- Snippet rewrites (title + description) for key locale homepages: `/`, `/en/`, `/tr/`, `/fr/`, `/de/`.
- Additional snippet/intention improvements for low-ROI pages: `/fi/`, `/en/how-to-play-solitaire/`, `/en/solitaire-strategy/`.
- Internal links from locale homepages to rules/how-to/strategy pages.

### Expected impact by checkpoint

- Overall CTR uplift: `+0.8` to `+1.5` percentage points vs pre-change reference window.
- Tier 1 locales (`/tr/`, `/fr/`): clicks uplift `+20%` to `+35%`.
- Desktop/mobile CTR gap: reduce by at least `25%` from current gap.
- Fewer zero-CTR queries in positions `<=20`.

### 2026-04-09 comparison checklist

1. Export GSC for the same dimensions:
   - pages
   - queries
   - devices
   - countries
2. Fill the checkpoint table below.
3. If CTR growth is below target:
   - test alternative title leads first (first 45 chars),
   - then iterate meta descriptions.

### Checkpoint table (fill on 2026-04-09)

| Metric | Baseline (pre-change) | Expected | Actual (2026-04-09) | Delta vs baseline | Status |
|---|---:|---:|---:|---:|---|
| Overall CTR |  | +0.8 to +1.5 p.p. |  |  |  |
| `/tr/` clicks | 52 | +20% to +35% |  |  |  |
| `/fr/` clicks | 12 | +20% to +35% |  |  |  |
| Desktop CTR | 1.58% | up |  |  |  |
| Mobile CTR | 4.22% | stable/up |  |  |  |
| Desktop/mobile gap | 2.64 p.p. | -25% or better |  |  |  |
| Zero-CTR queries (pos <=20) |  | down |  |  |  |

### Decision after checkpoint

- **Ship as-is**: if target met for overall CTR and at least one Tier 1 locale.
- **Iterate snippets**: if impressions are stable/up but CTR under target.
- **Re-check intent/page match**: if impressions rise but clicks do not.
