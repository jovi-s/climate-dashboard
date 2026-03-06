"""APScheduler setup: 48-hour job for news sentiment caching."""

import logging
import time

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from src.cache import CacheManager
from src.news_sentiment import OverallClimateNewsSentimentAnalyzer

logger = logging.getLogger(__name__)

NEWS_SENTIMENT_CACHE_KEY = "news_sentiment"
FUTURE_PROJECTION_PREFIX = "climate_future_projection_"


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

        # Evict stale future-projection entries (they depend on the news report)
        cache.clear_by_prefix(FUTURE_PROJECTION_PREFIX)

        return report
    except Exception:
        logger.exception("News-sentiment job FAILED")
        # Return stale data if available so callers aren't left empty-handed
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
