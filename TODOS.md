# TODOS

## P2: Lighthouse CI Performance Budget
**What:** Add `lhci` or `npm run lighthouse` to CI/CD with a performance score threshold of 90.
**Why:** The visual overhaul adds Canvas rendering + CSS animations — new performance surface area. Without a budget, future changes can silently degrade app speed. A performance budget creates a permanent guard rail.
**Effort:** S (human: ~2 hours / CC: ~5 min)
**Depends on:** Visual overhaul completion
**Context:** The app targets big tech portfolio reviewers who WILL check Lighthouse scores. A score above 90 demonstrates that the visual polish doesn't come at the cost of performance. Set up `lhci` in GitHub Actions with `performance >= 0.9` assertion. Use the `--chrome-flags="--no-sandbox"` flag for CI environments.

## P1: WCAG Contrast Verification Across Sky States
**What:** Run contrast ratio checks for all 18 sky/glass combinations (6 sky states × 3 glass variants) after visual overhaul ships.
**Why:** Dynamic backgrounds make contrast unpredictable. The Day sky with sky-tinted glass could fail for muted text colors (slate-400, slate-500). WCAG AA requires 4.5:1 for normal text, 3:1 for large text.
**Effort:** S (human: ~2 hours / CC: ~10 min with a verification script)
**Depends on:** Visual overhaul completion
**Context:** Write a script that renders each sky state, composites each glass variant on top, then checks contrast ratios for all text colors (slate-100 through slate-500) against the composite background. Flag any combination below 4.5:1. Likely fixes: increase glass background opacity for problem states, or bump muted text colors lighter on specific sky states via CSS custom properties.
