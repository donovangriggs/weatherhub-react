# WeatherHub — Design Decisions & Trade-offs

## Overview

WeatherHub is a real-time weather dashboard that displays a 7-day temporal window (3 days past, today, and 3 days forecast) for any location worldwide. It's built with React 19, TypeScript 5.9, Vite 7, and Tailwind CSS v4, featuring a glassmorphism UI, spring-powered animations, an interactive precipitation map, and offline-capable PWA support.

---

## API Choice: Open-Meteo vs WeatherStack

The assessment suggested WeatherStack, but Open-Meteo was chosen instead for several practical reasons:

| Concern | WeatherStack (Free Tier) | Open-Meteo |
|---------|-------------------------|------------|
| **API Key** | Required — must register and manage a key | None required — fully open access |
| **HTTPS** | HTTP only on free plan | HTTPS by default |
| **Forecast data** | Current weather only — no forecast on free tier | 7-day forecast + historical data included |
| **Sunrise/Sunset** | Not available on free tier | Included in daily parameters |
| **UV Index** | Paid plans only | Included |
| **Request limit** | 250 requests/month | Generous fair-use (10,000/day) |
| **CORS** | Requires backend proxy on some plans | Direct browser `fetch` works |
| **Cost** | Paid plans start at $10/month for forecast | Completely free, open-source |

**The critical blocker was HTTPS.** WeatherStack's free tier only serves data over HTTP. Any modern HTTPS-hosted site (Vercel, Netlify, GitHub Pages) would block these requests as mixed content. This would have required either a paid WeatherStack plan or a backend proxy — both unnecessary complexity for a front-end assessment.

Open-Meteo also provides the `past_days` parameter, which powers the temporal window feature (viewing historical weather alongside forecasts). WeatherStack's free tier has no historical data endpoint, so this feature wouldn't have been possible.

---

## Design Decisions & Trade-offs

### Glassmorphism UI

**Decision:** Used frosted-glass cards with `backdrop-blur`, semi-transparent backgrounds (`bg-white/5`), and subtle borders (`border-white/10`) on a dark base (`#101922`).

**Trade-off:** `backdrop-blur` is GPU-intensive compared to solid backgrounds. However, it creates visual depth and layering without requiring background images or gradients, keeping the bundle size small while achieving a modern aesthetic.

### 7-Day Temporal Window

**Decision:** Display 3 past days + today + 3 forecast days in a horizontally scrollable strip (mobile) or grid (desktop). Users can tap any day to update the hero section.

**Trade-off:** Fetching 7 days of data per request is heavier than fetching only today's weather. But it provides useful context — "Was yesterday warmer?" or "Is the weekend looking good?" — which makes the dashboard more genuinely useful than a current-conditions-only display.

### Value-Only Animations

**Decision:** When switching between days, only numeric values animate (temperature springs to new value, stats crossfade). Icons, labels, and structural layout remain completely static.

**Trade-off:** Less visually dramatic than animating entire sections in and out. But this eliminates layout shift, prevents the "flash of empty content" problem, and feels snappier. The user's eye stays on the data that actually changes.

### Spring-Based Temperature

**Decision:** Temperature uses `useSpring` and `useMotionValue` from Motion so the number rolls smoothly from one value to another (e.g., 72 → 58 counts down through intermediate values).

**Trade-off:** More complex than a simple fade-in of the new number. But it communicates *magnitude of change* — a big temperature swing produces a longer, more noticeable animation — which adds meaning beyond decoration.

### Two-Layer Caching (localStorage + Service Worker)

**Decision:** Weather data is cached in localStorage with a 15-minute TTL for instant re-renders. A Workbox service worker provides a second cache layer with per-resource strategies:
- `CacheFirst` for fonts and map tiles (immutable content)
- `StaleWhileRevalidate` for font stylesheets
- `NetworkFirst` with 5-second timeout for weather and geocoding APIs

**Trade-off:** Two caching layers adds complexity. But they serve different purposes: localStorage gives instant access to structured data on mount (no async needed), while the service worker handles raw HTTP responses including assets the app doesn't directly manage (fonts, map tiles). Together they enable true offline functionality — if you've visited before, the app works without internet.

### React Context Over State Library

**Decision:** A single `WeatherContext` provides all state (weather data, selected day, unit preference, location) to the entire component tree.

**Trade-off:** All context consumers re-render when any value changes. For a larger app, this would warrant splitting contexts or adopting Zustand/Redux. But WeatherHub has a flat component hierarchy with ~10 consumers, and weather updates are infrequent (user-initiated city changes or day selections), so the simplicity of a single context is the right trade-off here.

### Tailwind CSS v4

**Decision:** All styling done with Tailwind utility classes. No component CSS files, no CSS modules, no styled-components.

**Trade-off:** Class strings can be verbose (the hero section has lengthy `className` props). But it eliminates context-switching between files, removes naming debates, and makes responsive design explicit (`sm:`, `lg:` prefixes are visible inline). Tailwind v4's native CSS layer approach also means no PostCSS config needed.

### Geolocation with Graceful Fallback

**Decision:** On first visit, the app requests browser geolocation. If granted, it reverse-geocodes to get the city name. If denied or unavailable, it defaults to Cape Town, South Africa.

**Trade-off:** The geolocation prompt on first visit can be jarring. But it means returning users immediately see their local weather without any manual search, and the fallback ensures the app never shows a blank screen.

### Material Symbols (Variable Font)

**Decision:** Used Google's Material Symbols Outlined as a variable font for all icons throughout the app.

**Trade-off:** The variable font is ~200KB, which is larger than cherry-picking individual SVG icons. But it provides a consistent icon language across the entire app with optical size and weight axes, and the service worker caches it after first load so subsequent visits pay no cost.

---

## Testing Approach

61 tests using Vitest + React Testing Library:

- **Component tests** — Each major section (HeroSection, TemporalWindow, SecondaryInsights, Navbar) rendered with a mocked WeatherContext provider. Tests verify correct data display, user interactions (day selection, unit toggle, city search), and conditional rendering.
- **Hook tests** — Custom hooks (`useWeather`, `useGeocoding`, `useTemperatureUnit`) tested with `renderHook`, mocking `fetch` and `localStorage`.
- **Utility tests** — Pure function tests for temperature conversion, formatting, cache read/write, and weather code mapping.
- **API tests** — `fetchWeather` and `searchCities` tested with mocked `fetch` responses, including error cases.
