"""APScheduler setup: 48-hour job for news sentiment + future projection caching."""

import logging
import time
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from src.cache import CacheManager
from src.future_projection import generate_climate_future_projection
from src.news_sentiment import OverallClimateNewsSentimentAnalyzer

logger = logging.getLogger(__name__)

NEWS_SENTIMENT_CACHE_KEY = "news_sentiment"
FUTURE_PROJECTION_PREFIX = "climate_future_projection_"
PRECOMPUTED_PROJECTION_KEY = "precomputed_future_projection"

_SUMMARIES_DIR = Path(__file__).resolve().parent / "report_summaries"


def _load_report_summaries() -> tuple[str, str, str]:
    """Read the three static report summaries from disk."""
    copernicus = (_SUMMARIES_DIR / "copernicus.md").read_text(encoding="utf-8").strip()
    ipcc = (_SUMMARIES_DIR / "ipcc.md").read_text(encoding="utf-8").strip()
    wmo = (_SUMMARIES_DIR / "wmo.md").read_text(encoding="utf-8").strip()
    return copernicus, ipcc, wmo


def _precompute_projection(cache: CacheManager, news_report: str) -> None:
    """Generate the future projection using the latest news report and cache it."""
    logger.info("Pre-computing future projection...")
    start = time.monotonic()
    try:
        copernicus, ipcc, wmo = _load_report_summaries()
        projection = generate_climate_future_projection(
            news_report=news_report,
            copernicus=copernicus,
            ipcc=ipcc,
            wmo=wmo,
        )
        cache.set(PRECOMPUTED_PROJECTION_KEY, projection)
        elapsed = time.monotonic() - start
        logger.info("Future projection pre-computed in %.1f s", elapsed)
    except Exception:
        logger.exception("Pre-computing future projection FAILED (non-fatal)")


def run_news_sentiment_job(cache: CacheManager) -> str:
    """Execute the news-sentiment pipeline and write the result to *cache*.

    Returns the generated report (or the stale cached value on failure).
    """
    logger.info("News-sentiment job started")
    start = time.monotonic()
    try:
        analyzer = OverallClimateNewsSentimentAnalyzer(
            query="climate change, global warming", max_articles=20
        )
        report = analyzer.run()
        elapsed = time.monotonic() - start
        logger.info("News-sentiment job finished in %.1f s", elapsed)

        cache.set(NEWS_SENTIMENT_CACHE_KEY, report)

        # Evict stale per-request projection entries (they depend on the news report)
        cache.clear_by_prefix(FUTURE_PROJECTION_PREFIX)

        # Pre-compute the canonical future projection so GET requests are instant
        _precompute_projection(cache, report)

        return report
    except Exception:
        logger.exception("News-sentiment job FAILED")
        stale = cache.get_stale(NEWS_SENTIMENT_CACHE_KEY)
        if stale is not None:
            logger.warning("Returning stale news-sentiment cache as fallback")
            return stale
        raise


def setup_scheduler(cache: CacheManager) -> AsyncIOScheduler:
    """Create and return (but do not start) the scheduler with the 48-hour job."""
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        run_news_sentiment_job,
        trigger=IntervalTrigger(hours=48, timezone="UTC"),
        args=[cache],
        id="daily_news_sentiment",
        name="48-hour news-sentiment refresh",
        replace_existing=True,
        misfire_grace_time=3600,  # allow up to 1 h late execution
    )
    return scheduler
