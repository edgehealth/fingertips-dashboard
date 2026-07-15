# Fingertips Dashboard

A React-based health data visualisation tool built by Edge Health that displays performance indicators across England's Integrated Care Boards (ICBs). It provides an interactive map, line charts, and filtering tools for exploring NHS health metrics over time.

**Live site:** [https://edgehealth.github.io/fingertips-dashboard](https://edgehealth.github.io/fingertips-dashboard)

## Tech Stack

- **Framework:** React 19 + TypeScript
- **UI:** Material-UI (MUI 7), Emotion, styled-components
- **Charts:** Nivo (line, bar), Recharts
- **Build:** Create React App
- **Deployment:** GitHub Pages via GitHub Actions

## Getting Started

```bash
npm install
npm start       # Runs on localhost:3000
npm run build   # Production build
```

## API Connection

The dashboard connects to a custom Azure-hosted backend that aggregates Fingertips health data.

**Base URL:**
```
https://get-fingertips-data-akateqfdbxepgcht.uksouth-01.azurewebsites.net/api
```

**Authentication:** API key passed as a `code` query parameter.

**Versioning:** All routes are served under a `/v1` prefix.

**Endpoints:**

| Endpoint                    | Description                                    |
|-----------------------------|------------------------------------------------|
| `/v1/indicators`            | Health indicator data by `category` (paginated)|
| `/v1/indicators/{id}`       | All rows for a single indicator                |
| `/v1/indicator-metadata`    | Indicator metadata (id + name)                 |
| `/v1/genomics`              | Genomics metrics (paginated)                   |
| `/v1/health`                | Health check                                   |

Collection endpoints are paginated via `page` and `page_size` query params (max
`page_size` 5000). The API client (`fingertipsApi.ts`) pages through automatically
and concatenates results. Errors are returned as RFC 7807 `application/problem+json`
with a `correlationId` for support.

The API service lives in [`src/services/fingertipsApi.ts`](src/services/fingertipsApi.ts). API base URL and key are configured via environment variables:

```
REACT_APP_DASH_API_BASE_URL
REACT_APP_DASH_API_KEY
```

In production, these are injected from GitHub Secrets during the CI build.

## Data Structure

The `/v1/indicators` endpoint returns a paginated shape:

```typescript
{
  data: IndicatorData[];
  pagination: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}
```

Each `IndicatorData` record contains:

| Field                                    | Description                                          |
|------------------------------------------|------------------------------------------------------|
| `indicator_id`                           | Unique ID for the health metric                      |
| `indicator_name`                         | Human-readable metric name                           |
| `area_code`                              | Geographic code (e.g. `E92000001` for England)       |
| `area_name`                              | Human-readable area name (ICB name, "England", etc.) |
| `area_type`                              | Geography level (England, ICB, region)                |
| `sex`                                    | Sex filter                                           |
| `age`                                    | Age group filter                                     |
| `time_period`                            | Reporting period (e.g. `2023/24`)                    |
| `value`                                  | The metric value                                     |
| `count`                                  | Numerator count                                      |
| `denominator`                            | Denominator for rate calculations                    |
| `value_note`                             | Category label (e.g. "Prevention", "Digital")        |
| `compared_to_england_value_or_percentiles` | Comparison against national benchmark              |
| `time_period_sortable`                   | Numeric field for chronological ordering             |

Full type definitions are in [`src/types/API.ts`](src/types/API.ts).

## Geographic Data

The map uses two GeoJSON boundary files stored locally in [`src/data/`](src/data/):

| File                    | Description                  |
|-------------------------|------------------------------|
| `icb-boundaries.json`   | ICB geographic boundaries    |
| `sicb-boundaries.json`  | Sub-ICB geographic boundaries|

These contain `MultiPolygon` features with properties like `icb23cd` (ICB code) and `icb23nm` (ICB name), which are matched against the API's `area_code` field to render data on the map.

## Key Features

- **Interactive ICB Map** — SVG map colour-coded by metric value (light-to-dark blue gradient). Click an ICB to select it.
- **Metric Selector** — Dropdown grouped by category (`value_note`), dynamically populated from the API data.
- **Year Slider** — Navigate between available time periods for the selected metric.
- **Line Chart** — Compare a selected ICB's trend against the England average over time.
- **Sidebar Details** — Shows the selected ICB's value, England average, and value range for the chosen metric/year.
- **Responsive Layout** — Adapts to mobile, tablet, and desktop breakpoints.

## Project Structure

```
src/
├── context/FingertipsContext.tsx    # Global data context (API fetch + state)
├── services/fingertipsApi.ts       # API client
├── pages/Fingertips/
│   ├── Fingertips.tsx              # Main page
│   ├── hooks/                      # useFilter, useMap custom hooks
│   ├── utils/                      # Date sorting utilities
│   └── components/
│       ├── HeaderBanner/           # Top banner with logo & title
│       ├── FilterPanel/            # Metric selector
│       └── ChartPanel/
│           ├── Charts/             # ICBLineChart, ICBMap, MapColorLegend
│           ├── Petals/             # Map + sidebar layout containers
│           └── SharedComponents/   # YearSlider, MapSidebar, DHSCLogo
├── types/                          # TypeScript type definitions
├── theme/                          # MUI theme, colours, typography
├── data/                           # GeoJSON boundary files
└── assets/                         # Images & logos
```

## Deployment

Deployment is automated via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)):

1. Triggered on push to `master`
2. Installs dependencies and builds
3. Deploys the `build/` folder to GitHub Pages

Required GitHub Secrets:
- `REACT_APP_DASH_API_BASE_URL`
- `REACT_APP_DASH_API_KEY`
