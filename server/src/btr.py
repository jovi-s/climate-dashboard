# import streamlit as st
import os

from dotenv import load_dotenv
from llama_index.core import Settings, StorageContext, load_index_from_storage
from llama_index.core.postprocessor import SentenceTransformerRerank
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Get LLM_MODEL from the environment variables
Settings.llm = OpenAI(temperature=0, model=os.getenv("LLM_MODEL"))
Settings.embed_model = OpenAIEmbedding(model=os.getenv("EMBEDDING_MODEL"))


class BTRRAGAgent:
    def __init__(self, country: str = "Singapore"):
        self.country = country
        self.btr_rag_agent = self.btr_rag_engine()

    def get_btr_pdf(
        self, base_link="https://unfccc.int/first-biennial-transparency-reports"
    ):
        pass

    def btr_rag_engine(self):
        """Code adapted from:
        https://docs.llamaindex.ai/en/stable/examples/cookbooks/oreilly_course_cookbooks/Module-8/Advanced_RAG_with_LlamaParse/#llamaparse-pdf-reader-for-pdf-parsing
        https://docs.llamaindex.ai/en/stable/examples/node_postprocessor/SentenceTransformerRerank/
        """

        recursive_index = load_index_from_storage(
            StorageContext.from_defaults(
                persist_dir=f"./data/vector_store/btr/{self.country}"
            ),
        )

        reranker = SentenceTransformerRerank(model="models/rerank", top_n=5)

        recursive_query_engine = recursive_index.as_query_engine(
            similarity_top_k=15, node_postprocessors=[reranker], verbose=True
        )

        return recursive_query_engine

    def query(self, prompt: str) -> str:
        return str(self.btr_rag_agent.query(prompt))
