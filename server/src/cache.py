"""Dual-layer cache: in-memory dict backed by JSON files on disk."""

import hashlib
import json
import logging
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

logger = logging.getLogger(__name__)

CACHE_DIR = Path(__file__).resolve().parent.parent / "data" / "cache"
DEFAULT_MAX_AGE_HOURS = 25  # 25 h so a midnight-to-midnight window always overlaps


class CacheManager:
    """Thread-safe, dual-layer (memory + disk) cache with timestamp freshness."""

    def __init__(
        self, cache_dir: Path = CACHE_DIR, max_age_hours: float = DEFAULT_MAX_AGE_HOURS
    ):
        self._cache_dir = cache_dir
        self._cache_dir.mkdir(parents=True, exist_ok=True)
        self._max_age_hours = max_age_hours
        self._store: dict[str, dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._load_disk()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get(self, key: str) -> Optional[Any]:
        """Return cached data for *key* if it exists and is fresh, else ``None``."""
        with self._lock:
            entry = self._store.get(key)
        if entry is None:
            return None
        if not self._entry_is_fresh(entry):
            return None
        return entry["data"]

    def get_stale(self, key: str) -> Optional[Any]:
        """Return cached data even if expired (useful as fallback)."""
        with self._lock:
            entry = self._store.get(key)
        if entry is None:
            return None
        return entry["data"]

    def set(self, key: str, data: Any) -> None:
        """Write *data* to both in-memory store and disk."""
        entry = {
            "key": key,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": data,
        }
        with self._lock:
            self._store[key] = entry
        self._write_disk(key, entry)
        logger.info("Cache SET  key=%s  ts=%s", key, entry["timestamp"])

    def is_fresh(self, key: str) -> bool:
        with self._lock:
            entry = self._store.get(key)
        if entry is None:
            return False
        return self._entry_is_fresh(entry)

    def clear_by_prefix(self, prefix: str) -> int:
        """Remove all entries whose key starts with *prefix*. Returns count removed."""
        removed = 0
        with self._lock:
            keys = [k for k in self._store if k.startswith(prefix)]
            for k in keys:
                del self._store[k]
                removed += 1
        # Also remove disk files
        for path in self._cache_dir.glob(f"{prefix}*"):
            path.unlink(missing_ok=True)
        if removed:
            logger.info("Cache CLEAR prefix=%s  removed=%d", prefix, removed)
        return removed

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def make_hash(*parts: str) -> str:
        """Return a short SHA-256 hex digest of the concatenated *parts*."""
        h = hashlib.sha256("".join(parts).encode())
        return h.hexdigest()[:16]

    def _entry_is_fresh(self, entry: dict) -> bool:
        ts = datetime.fromisoformat(entry["timestamp"])
        age = (datetime.now(timezone.utc) - ts).total_seconds() / 3600
        return age < self._max_age_hours

    def _disk_path(self, key: str) -> Path:
        safe = key.replace("/", "_").replace(":", "_")
        return self._cache_dir / f"{safe}.json"

    def _write_disk(self, key: str, entry: dict) -> None:
        try:
            self._disk_path(key).write_text(
                json.dumps(entry, ensure_ascii=False), encoding="utf-8"
            )
        except Exception:
            logger.exception("Failed to write cache to disk for key=%s", key)

    def _load_disk(self) -> None:
        """Load all JSON cache files from disk into memory on startup."""
        count = 0
        for path in self._cache_dir.glob("*.json"):
            try:
                entry = json.loads(path.read_text(encoding="utf-8"))
                key = entry.get("key", path.stem)
                self._store[key] = entry
                count += 1
            except Exception:
                logger.exception("Failed to load cache file %s", path)
        logger.info("Loaded %d cache entries from disk", count)
