# TODOS

## P2: Lighthouse CI Performance Budget
**What:** Add `lhci` or `npm run lighthouse` to CI/CD with a performance score threshold of 90.
**Why:** The visual overhaul adds Canvas rendering + CSS animations — new performance surface area. Without a budget, future changes can silently degrade app speed. A performance budget creates a permanent guard rail.
**Effort:** S (human: ~2 hours / CC: ~5 min)
**Depends on:** Visual overhaul completion
**Context:** The app targets big tech portfolio reviewers who WILL check Lighthouse scores. A score above 90 demonstrates that the visual polish doesn't come at the cost of performance. Set up `lhci` in GitHub Actions with `performance >= 0.9` assertion. Use the `--chrome-flags="--no-sandbox"` flag for CI environments.

## P2: WCAG Contrast Verification
**What:** Verify contrast ratios for all text colors (slate-100 through slate-500) against the static sky gradient + 3 glass variants (glass, glass-active, glass-tinted).
**Why:** WCAG AA requires 4.5:1 for normal text, 3:1 for large text. The dark glass overlay (rgba(0,0,0,0.25)) on the deep blue gradient should pass, but hasn't been formally verified.
**Effort:** S (human: ~1 hour / CC: ~5 min)
**Depends on:** Visual overhaul completion
**Context:** Simplified from the original 18-combination check — now using a single static gradient (#0a1628 → #122a4a → #1a3a5c) instead of 6 time-of-day palettes. Check 3 glass variants × 5 text colors = 15 combinations.
