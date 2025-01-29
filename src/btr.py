import os

import streamlit as st
from llama_index.core import Settings, StorageContext, load_index_from_storage
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.postprocessor.flag_embedding_reranker import (
    FlagEmbeddingReranker,
)
from llama_index.core.tools import QueryEngineTool
from llama_index.core.agent import ReActAgent


os.environ["OPENAI_API_KEY"] = st.secrets["OPENAI_API_KEY"]


def get_btr_pdf(base_link="https://unfccc.int/first-biennial-transparency-reports"):
    pass


def btr_rag(country="Singapore"):
    """Code adapted from:
    https://docs.llamaindex.ai/en/stable/examples/cookbooks/oreilly_course_cookbooks/Module-8/Advanced_RAG_with_LlamaParse/#llamaparse-pdf-reader-for-pdf-parsing
    """

    embed_model = OpenAIEmbedding(model="text-embedding-3-small")
    llm = OpenAI(model="gpt-4o-mini")

    Settings.llm = llm
    Settings.embed_model = embed_model

    recursive_index = load_index_from_storage(
        StorageContext.from_defaults(persist_dir=f"./data/vector_store/btr/{country}"),
    )

    reranker = FlagEmbeddingReranker(
        top_n=5,
        model="BAAI/bge-reranker-large",
    )

    recursive_query_engine = recursive_index.as_query_engine(
        similarity_top_k=15, node_postprocessors=[reranker], verbose=True
    )

    return recursive_query_engine

    # country_tool = QueryEngineTool.from_defaults(
    #     recursive_query_engine,
    #     name=f"{country}_BTR",
    #     description=f"Provides information about a country's BTR which includes details on national inventory reports (NIR), progress towards NDCs, policies and measures, climate change impacts and adaptation, levels of financial, technology development and transfer and capacity-building support, capacity-building needs and areas of improvement. Ask natural-language questions about the BTR."
    # )

    # agent = ReActAgent.from_tools([country_tool], verbose=True, context="""
# You are an agent designed to answer queries about a given country's Biennial Transparency Report (BTR).
# Please always use the tool provided to answer a question. Do not rely on prior knowledge.
# """)

    # return agent
