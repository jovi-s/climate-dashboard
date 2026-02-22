"""Generate a short climate future projection from news report and report summaries."""

import os
from pathlib import Path

import yaml
from dotenv import load_dotenv
from llama_index.llms.openai import OpenAI

load_dotenv()

_PROMPTS_PATH = Path(__file__).resolve().parent / "prompts.yaml"


def _load_prompt() -> str:
    with open(_PROMPTS_PATH, "r") as f:
        prompts = yaml.safe_load(f)
    return prompts.get("climate-future-projection", "")


def generate_climate_future_projection(
    news_report: str,
    copernicus: str,
    ipcc: str,
    wmo: str,
) -> str:
    """Call the LLM to produce a short future projection from the four sources."""
    system_prompt = _load_prompt()
    user_content = f"""\
## 1. Recent climate news (web search summary and sentiment)
{news_report}

## 2. Copernicus Global Climate Highlights (2022–2025) – longitudinal summary
{copernicus}

## 3. IPCC Assessment Reports AR4–AR6 – longitudinal summary
{ipcc}

## 4. WMO State of the Global Climate (2020–2024) – longitudinal summary
{wmo}

---
Based on the four sources above, provide your short future projection of the climate crisis."""
    # Single prompt: system instruction + user content (LlamaIndex complete() takes one prompt)
    full_prompt = f"{system_prompt}\n\n---\n\n{user_content}"
    llm = OpenAI(temperature=0, model=os.getenv("LLM_MODEL"))
    response = llm.complete(prompt=full_prompt)
    return (response.text or "").strip()
