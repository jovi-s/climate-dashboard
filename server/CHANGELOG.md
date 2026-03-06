# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-03-05

- Create 48H caching system for web search and LLM API responses
- Rename app.py to streamlit_app.py
- Move previous Github Container Registry deployment code to README

## [0.2.0] - 2026-03-01

- Add IPCC, Copernicus GCH, and WMO Report summaries and projections
- Upgrade from poetry to uv
- Fix world ocean warming graph
- Update NDC, BTR summaries using Gemini 3.1 Pro (more information in README)
- Update NDC3.0 tracking and respective PDF documents
- Removed section headers from Changelog

## [0.1.5] - 2025-05-11

- Added `typing.py`.
- Added `ruff.toml`.
- Moved BTR class to `btr.py`.

## [0.1.4] - 2025-04-19

- Added Singapore BTR Summary.
- Added more search terms for DDG internet search.
- Updated Singapore's NDC Summary using `gemini-2.5-pro`.
- Moved NDC Tracker dict data from `server/src/utils.py` to the frontend (`ndc/page.tsx`).
- Reduced BTR Chatbot height from 110 to 80.
- Changed BTR load button to blue and removed external spinner.
- Updated FastAPI script to use async functions.
- Removed FastAPI endpoint for NDCTracker.

## [0.1.3] - 2025-04-06

- Modified NDC UI using v0 template.

## [0.1.2] - 2025-04-03

- Added simplified section with cyclic COP process.
- Modified homepage UI using v0 template.

## [0.1.1] - 2025-03-03

- Added Singapore NDC 2.
- Added news sentiment report generation script and endpoint route.
- Added new images (CO2 climb, hottest years).
- Hardcoded link to Singapore BTR.
- Updated climate spiral GIF.

## [0.1.0] - 2025-02-02

- Added frontend Next.js 15 client with Tailwind CSS, Shadcn components, and Vercel AI SDK.
- Moved Python directory to `server/`.
- Fixed FastAPI endpoint routes.

## [0.0.4] - 2025-01-30

- Added BTR RAG chatbot.
- Added reasoning models' Singapore NDC summarization.
- Converted live Singapore NDC summarization to load from text file.
- Moved NDC vector stores to `data/vector_store/bdc`.
- Updated Python version from 3.12.6 to 3.12.8.
- Updated Poetry version from 1.7 to 2.0.
- Removed Excel sheet and its graph plot exploratory notebook.

## [0.0.3] - 2024-10-12

- Added AI summary and comparison for NDCs.
- Added Streamlit cache for resources and data.
- Added earth tipping points image.
- Fixed climate spiral GIF.
- Updated images.
- Fixed issue with the ocean warming graph not loading.
- Updated Climate Central images for climate stripes.
- Removed regional tab.

## [0.0.2] - 2024-10-05

- Added Ruff settings in `pyproject.toml`.
- Added list of countries in the world.
- Added tabs for NDCs, NCQG, and Take Action.
- Fixed ocean warming graph not loading.
- Upgraded dependencies: Ruby 3.2.1, Middleman, etc.
- Removed unused `normalize.css` file.
- Removed identical links assigned in each translation file.
- Removed duplicate index file for the English version.

## [0.0.1] - 2024-08-01

- Used images data and URLs for plotting graphs.
