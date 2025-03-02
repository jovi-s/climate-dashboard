#!/usr/bin/env python
import os

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from llama_index.core import (
    Document,
    DocumentSummaryIndex,
    Settings,
    get_response_synthesizer,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

load_dotenv()

# Get LLM_MODEL from the environment variables
Settings.llm = OpenAI(temperature=0, model=os.getenv("LLM_MODEL"))
Settings.embed_model = OpenAIEmbedding(model=os.getenv("EMBEDDING_MODEL"))


class OverallClimateNewsSentimentAnalyzer:
    def __init__(self, query="climate change", max_articles=5):
        self.query = query
        self.max_articles = max_articles
        self.articles = []
        self.summary_index = None

    def search_news(self):
        """Search for recent news articles about the query using DuckDuckGo."""
        print(f"Searching for news articles about: {self.query}")
        with DDGS() as ddgs:
            # timelimit='m' specifies articles from the past month
            results = ddgs.news(
                keywords=self.query,
                region="wt-wt",
                safesearch="Moderate",
                timelimit="m",
                max_results=self.max_articles,
            )
        if not results:
            print("No results found.")
            return
        self.articles = []
        for res in results:
            self.articles.append(
                {
                    "title": res.get("title", "No Title"),
                    "url": res.get("url"),
                    "snippet": res.get("body", ""),
                    "text": "",
                }
            )
        print(f"Found {len(self.articles)} articles.")

    def extract_articles(self):
        """Extract the main content from each article using BeautifulSoup."""
        for article in self.articles:
            url = article["url"]
            try:
                print(f"Extracting content from: {url}")
                response = requests.get(url, timeout=10)
                soup = BeautifulSoup(response.text, "html.parser")
                # Extract text from all paragraph tags
                paragraphs = [p.get_text() for p in soup.find_all("p")]
                content = "\n".join(paragraphs)
                article["text"] = content
            except Exception as e:
                print(f"Error extracting content from {url}: {e}")
                article["text"] = ""

    def get_combined_text(self):
        """Combine the text from all articles into a single string."""
        combined_text = "\n".join(
            article["text"] for article in self.articles if article["text"]
        )
        return combined_text

    def _create_summary_index(self, combined_text):
        """Create a SummaryIndex from a list of Document objects."""
        if not combined_text:
            print("No documents to create the index.")

        doc = Document(text=combined_text)

        # default mode of building the index
        response_synthesizer = get_response_synthesizer(
            response_mode="tree_summarize", use_async=True
        )
        splitter = SentenceSplitter(chunk_size=1024)
        self.summary_index = DocumentSummaryIndex.from_documents(
            [doc],
            llm=Settings.llm,
            transformations=[splitter],
            response_synthesizer=response_synthesizer,
            show_progress=False,
        )

    def summarize_text(self):
        """Generate a summary from the combined text using LlamaIndex's SummaryIndex."""
        try:
            summary_query_engine = self.summary_index.as_query_engine(llm=Settings.llm)
            response = summary_query_engine.query(
                "Provide a concise summary of these climate change news articles."
            )
            summary = str(response)
        except Exception as e:
            print(f"Error during summarization: {e}")
            summary = "Summary could not be generated."
        return summary

    def analyze_overall_sentiment(self):
        """Perform sentiment analysis on the combined text using LlamaIndex and OpenAI's model."""
        try:
            # Craft a prompt that instructs the model to determine the overall sentiment
            prompt = (
                "Analyze the overall sentiment of the following news articles related to climate change. "
                "Consider various aspects such as the urgency of the situation, the effectiveness of current measures, "
                "the increasing severity of damages, the rising frequency of extreme weather events, and the alarming trends "
                "in temperature records. Please provide a comprehensive sentiment analysis that captures the nuances of these "
                "articles in clear and accessible language."
            )
            # Query the index using the prompt
            query_engine = self.summary_index.as_query_engine(
                response_mode="tree_summarize", use_async=True
            )
            response = query_engine.query(prompt)
            sentiment_analysis = str(response)
            return sentiment_analysis
        except Exception as e:
            print(f"Error during sentiment analysis: {e}")
            return "Unknown"

    def generate_markdown_report(self, summary, sentiment):
        """Generate a Markdown formatted report with the summary and overall sentiment."""
        md_lines = []
        md_lines.append("# Overall Climate Change News Sentiment Report\n")
        md_lines.append("## Summary of News Articles\n")
        md_lines.append(summary + "\n")
        md_lines.append("## Overall Sentiment Analysis\n")
        md_lines.append(f"**Sentiment:** {sentiment}\n")
        return "\n".join(md_lines)

    def run(self):
        """Execute the full pipeline: search, extraction, summarization, and overall sentiment analysis."""
        self.search_news()
        self.extract_articles()
        combined_text = self.get_combined_text()
        self._create_summary_index(combined_text)
        if not combined_text:
            print("No article content available.")
            return "No content to analyze."
        # Generate a summary of all the combined text
        summary = self.summarize_text()
        # Get overall sentiment for the combined text
        sentiment = self.analyze_overall_sentiment()
        # Create a Markdown report with the results
        markdown_report = self.generate_markdown_report(summary, sentiment)
        return markdown_report


if __name__ == "__main__":
    analyzer = OverallClimateNewsSentimentAnalyzer(
        query="climate change, global warming", max_articles=5
    )
    report = analyzer.run()
    print(report)
