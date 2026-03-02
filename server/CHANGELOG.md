# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Options are: Added, Changed, Removed, Fixed.

## [0.2.0] - 2026-03-01

- Add IPCC, Copernicus GCH, and WMO Report summaries and projections
- Upgrade from poetry to uv
- Fix world ocean warming graph
- Update NDC, BTR summaries using Gemini 3.1 Pro (more information in README)
- Update NDC3.0 tracking and respective PDF documents

## [0.1.5] - 2025-05-11

### Added

- Add typing.py
- Add ruff.toml

### Changed

- Move BTR class to btr.py 

## [0.1.4] - 2025-04-19

## Added

- Singapore BTR Summary
- More search terms for DDG internet search

## Changed

- Updated Singapore's NDC Summary using gemini-2.5-pro
- Moved NDC Tracker dict data from server/src/utils.py to front-end (ndc/page.tsx)
- Reduced BTR Chatbot height from 110 -> 80
- Changed BTR load button to blue and remove external spinner
- Use async functions for FastAPI script

## Removed

- FastAPI endpoint for NDCTracker

## [0.1.3] - 2025-04-06

## Changed

- Modify NDC UI using v0 template

## [0.1.2] - 2025-04-03

## Added

- Add simplified section with cyclic COP process

## Changed

- Modify Homepage UI using v0 template

## [0.1.1] - 2025-03-03

## Added

- Singapore NDC 2
- News Sentiment Report Generation Script + Endpoint Route
- New Images (CO2 Climb, Hottest Years)
- Hardcode link to Singapore BTR 

## Changed

- Update Climate Spiral GIF

## [0.1.0] - 2025-02-02

### Added

- Frontend Next.js 15 Client with Tailwind.css, Shadcn Components, and Vercel AI SDK

### Changed

- Moved Python directory to server/

### Fixed 

- FastApi endpoint routes

## [0.0.4] - 2025-01-30

### Added

- BTR RAG Chatbot
- Reasoning Models' Singapore NDC Summarization

### Changed

- Convert live Singapore NDC Summarization to load from txt file
- Move NDC vector stores to data/vector_store/bdc
- Update Python version from 3.12.6 -> 3.12.8
- Update Poetry version from 1.7 -> 2.0

### Removed

- Excel Sheet and its graph plot exploratory notebook

## [0.0.3] - 2024-10-12

### Added

- AI summary and comaparison for NDCs
- Streamlit cache for resources and data
- Add earth tipping points image

### Fixed

- Climate spiral gif
- Update images
- Fix the issue with the Ocean Warming Graph Not Loading

### Changed

- Update climate central images for climate stripes

### Removed

- Regional Tab

## [0.0.2] - 2024-10-05

### Added

- Ruff settings in pyproject.toml
- List of countries in the world
- Tabs for NDCs, NCQG, Take Action

### Fixed

- Ocean Warming Graph Not Loading

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.
- Duplicate index file for the english version.

## [0.0.1] - 2024-08-01

### Added

- Use images data, and URL for plotting graphs
