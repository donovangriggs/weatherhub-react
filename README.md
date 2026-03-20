# WeatherHub

A real-time weather dashboard built with React 19, TypeScript 5.9, and Vite 7. Features a glassmorphism UI design, responsive layout for mobile and desktop, spring-powered animations, and offline-capable PWA support.

## Features

- **Immersive Atmosphere** — Dynamic sky gradient background with CSS weather particle effects (rain, snow, fog, clouds, thunderstorm lightning)
- **7-Day Temporal Window** — View past and forecast weather data with horizontal scroll on mobile
- **Live Weather Data** — Powered by the Open-Meteo API (free, no API key required)
- **Favorites & Recents** — Save up to 5 favorite locations, auto-track recent searches with quick-switch bar
- **City Search** — Debounced geocoding search with dropdown results
- **Unit Toggle** — Switch between Fahrenheit and Celsius with animated sliding indicator
- **Temperature-Responsive Typography** — Font weight shifts with temperature (lighter = colder, bolder = hotter)
- **Interactive Map** — Leaflet-powered precipitation map with location marker
- **Animations** — Motion (Framer Motion) for entrance stagger, spring-animated temperatures, and crossfade transitions
- **Progressive Enhancement** — 3 performance levels with auto-degradation (reduced-motion / CSS-only / CSS+Canvas)
- **PWA Support** — Service worker with intelligent caching strategies for offline use
- **Responsive Design** — Optimized layouts for mobile, tablet, and desktop

## Tech Stack

- **Framework:** React 19 with TypeScript 5.9
- **Build:** Vite 7
- **Styling:** Tailwind CSS v4 with glassmorphism design
- **Animation:** Motion (Framer Motion rebrand)
- **Maps:** Leaflet.js
- **Testing:** Vitest + React Testing Library (117 tests)
- **PWA:** vite-plugin-pwa with Workbox

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start development server                 |
| `npm run build`    | Production build with PWA service worker |
| `npm run preview`  | Preview production build locally         |
| `npx vitest run`   | Run all tests                            |
| `npx tsc --noEmit` | Type check without emitting              |

## Caching Strategy

WeatherHub uses a multi-layer caching approach:

1. **localStorage** — Weather data cached with 15-minute TTL, user preferences persisted
2. **Service Worker (Workbox)** — Precaches static assets, runtime caches API responses and fonts
3. **Cache Strategies:**
   - `CacheFirst` for Google Fonts webfonts and map tiles (immutable content)
   - `StaleWhileRevalidate` for Google Fonts stylesheets
   - `NetworkFirst` with 5s timeout for weather and geocoding APIs

## Project Structure

```
src/
├── api/            # API fetch functions (weather, geocoding)
├── animation/      # Shared Motion animation variants
├── components/
│   ├── atmosphere/ # Sky gradient, weather effects (CSS + Canvas), loading screen
│   ├── hero/       # Main weather display (temperature, illustration, stats)
│   ├── temporal/   # 7-day forecast tiles
│   ├── insights/   # Daylight schedule, precipitation map
│   ├── layout/     # Navbar, Footer
│   └── ui/         # Reusable components (GlassCard, SearchInput, QuickSwitcher, etc.)
├── context/        # React context for weather state
├── hooks/          # Custom hooks (useWeather, useGeocoding, etc.)
├── types/          # TypeScript interfaces
├── utils/          # Helpers (cache, formatting, conversions)
└── __tests__/      # Test files mirroring src structure
```
