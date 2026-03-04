# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack climate change dashboard that visualizes climate data and provides AI-powered analysis tools. The application displays global climate statistics, NDC (Nationally Determined Contributions) comparisons, and provides interactive chat capabilities for climate data exploration.

**Current Deployment:**
- Frontend: Next.js client on Vercel (GitHub integration)
- Backend: FastAPI Python server on Railway.app via GitHub Container Registry

## Tech Stack

**Backend (this directory):**
- Python 3.12 with uv for dependency management
- FastAPI for REST API
- LlamaIndex for RAG (Retrieval-Augmented Generation)
- Matplotlib for data visualization
- Sentence Transformers for embeddings
- PyTorch (CPU-only builds for different platforms)

**Frontend (`../client`):**
- Next.js 16 with React 19
- TypeScript
- Tailwind CSS with Radix UI components
- Vercel AI SDK for streaming responses
- Recharts for data visualization

## Development Commands

### Full-stack development (from repository root)
```bash
make dev              # Run both frontend and backend concurrently
make dev-frontend     # Run Next.js dev server only
make dev-backend      # Run FastAPI with hot reload only
```

### Backend-only commands (from `server/` directory)
```bash
make install          # Install dependencies with uv
make lint             # Run ruff linter and formatter on src/
make fastapi          # Run FastAPI dev server with hot reload
```

### Docker commands
```bash
make server-build     # Build Docker image for linux/amd64
make server-run       # Run Docker container locally on port 8080
make gcr              # Build and push to GitHub Container Registry
```

### Frontend commands (from `client/` directory)
```bash
npm run dev           # Run Next.js dev server with Turbopack
npm run build         # Build production bundle
npm run lint          # Run ESLint
```

## Architecture

### Backend Structure

```
server/
├── fastapi_app.py         # Main FastAPI application with CORS and endpoints
├── src/                   # Source modules
│   ├── config.yaml        # Data sources, image URLs, and configuration
│   ├── btr.py            # BTR (Biennial Transparency Report) RAG agent
│   ├── ndc_inference.py  # NDC comparison using LlamaIndex multi-agent system
│   ├── news_sentiment.py # Climate news sentiment analysis
│   ├── plot_graphs.py    # Matplotlib plotting functions for climate data
│   └── utils.py          # Data fetching utilities
├── data/                  # Climate datasets and PDFs
│   ├── ndc/              # NDC documents by country
│   ├── btr/              # BTR reports
│   ├── naps/             # National Adaptation Plans
│   ├── wmo_reports/      # World Meteorological Organization reports
│   └── vector_store/     # LlamaIndex vector embeddings
└── models/               # Machine learning model storage
```

**Key API Endpoints:**
- `/plot/*` - Returns base64-encoded Matplotlib plots for climate data (CO2, methane, temperature anomaly, ocean warming)
- `/api/cat-summary` - Climate Action Tracker summaries by country
- `/api/ndc-comparison` - Compare NDCs across multiple countries using LlamaIndex agents
- `/api/initialize-btr-rag` - Initialize RAG engine for BTR document queries
- `/api/btr-chat` - Streaming chat interface for BTR queries (Vercel AI SDK compatible)
- `/api/news-sentiment` - Analyze climate news sentiment using DuckDuckGo search
- `/images/url-links` - Retrieve curated climate visualization URLs from config.yaml

### Frontend Structure

```
client/src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout with theme provider
│   ├── local/            # Local climate data view
│   ├── ndc/              # NDC comparison interface
│   ├── btr/              # BTR chat interface
│   └── wmo/              # WMO reports viewer
├── components/           # React components
│   ├── data-graphs.tsx   # Climate data visualization charts
│   ├── ndc-tracker.tsx   # NDC country comparison UI
│   ├── chat.tsx          # Chat interface component
│   ├── news-sentiment.tsx # News sentiment display
│   └── ui/               # Radix UI component wrappers
└── hooks/                # Custom React hooks
```

## Important Patterns

**Data Flow:**
1. Backend fetches climate data from NOAA, NASA, and other sources on startup (configured in `config.yaml`)
2. Matplotlib generates plots server-side, returned as base64-encoded images
3. Frontend displays images and provides interactive controls
4. RAG agents use LlamaIndex with OpenAI embeddings for document analysis

**Environment Variables:**
- Backend requires `.env` with OpenAI API keys for LlamaIndex agents
- Frontend requires `.env` with `NEXT_PUBLIC_API_URL` pointing to backend

**Linting:**
- Backend uses Ruff with `--fix` and `--unsafe-fixes` flags (config in `ruff.toml`)
- Frontend uses ESLint with Next.js config

**Docker:**
- Multi-stage build reduces final image size
- Exposes port 8080 (but CMD runs on 8081 - deployment handles mapping)
- Platform targeting: `linux/amd64` for deployment compatibility

## Data Sources

Climate data is fetched from authoritative sources (configured in `src/config.yaml`):
- NOAA: CO2 and methane measurements
- NASA GISS: Global temperature anomalies
- NASA ECCO: Ocean warming data
- Climate Action Tracker: Policy analysis and projections
- UNFCCC: NDC and BTR documents

The `data/` directory contains PDFs and structured documents that are indexed for RAG queries. Vector stores are persisted locally and loaded on startup.
