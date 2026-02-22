# import streamlit as st
import logging
import os

from dotenv import load_dotenv
from llama_index.agent.openai import OpenAIAgent
from llama_index.core import (
    Settings,
    SimpleDirectoryReader,
    StorageContext,
    SummaryIndex,
    VectorStoreIndex,
    load_index_from_storage,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.objects import ObjectIndex
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()

# Get LLM_MODEL from the environment variables
llm_model = os.getenv("LLM_MODEL")
embed_model = os.getenv("EMBEDDING_MODEL")


# Global variables to store agents and query engines
agents = {}
query_engines = {}


def load_ndc_data():
    """Load NDC data and initialize agents and query engines.
    NDCs from: https://unfccc.int/NDCREG
    Code Adapted from: https://docs.llamaindex.ai/en/stable/examples/agent/multi_document_agents/
    """
    global agents, query_engines
    Settings.llm = OpenAI(temperature=0, model=llm_model)
    Settings.embed_model = OpenAIEmbedding(model=embed_model)

    node_parser = SentenceSplitter()

    ndc_file_name_path_mapping = {
        'Cambodia': 'data/ndc/Cambodia/2025- Cambodia-NDC 3.0_0.pdf', 
        'Myanmar': 'data/ndc/Myanmar/Myanmar Updated  NDC July 2021.pdf', 
        'Laos': 'data/ndc/Laos/NDC 2020 of Lao PDR (English), 09 April 2021 (1).pdf', 
        'Singapore': 'data/ndc/Singapore/Singapore_Second_Nationally_Determined_Contribution.pdf',
        'Brunei': "data/ndc/Brunei/[Final] Brunei Darussalam's Nationally Determined Contribution 3.0 2025.pdf", 
        'Vietnam': 'data/ndc/Vietnam/Viet Nam NDC 2022 Update.pdf', 
        'Malaysia': 'data/ndc/Malaysia/Malaysia NDC 3.0 to UNFCCC 2025 final.pdf', 
        'Indonesia': 'data/ndc/Indonesia/Indonesia_Second NDC_2025.10.24.pdf',
        'Thailand': 'data/ndc/Thailand/TH NDC 3.0.pdf',
        "Philippines": "data/ndc/Philippines/Philippines - NDC.pdf",
    }

    sea_countries = list(ndc_file_name_path_mapping.keys())

    # Load all country documents
    country_docs = {}
    for country in sea_countries:
        country_docs[country] = SimpleDirectoryReader(
            input_files=[ndc_file_name_path_mapping[country]]
        ).load_data()

    for idx, country in enumerate(sea_countries):
        nodes = node_parser.get_nodes_from_documents(country_docs[country])

        # load index
        vector_index = load_index_from_storage(
            StorageContext.from_defaults(
                persist_dir=f"./data/vector_store/ndc/{country}"
            ),
        )

        # build summary index
        summary_index = SummaryIndex(nodes)
        # define query engines
        vector_query_engine = vector_index.as_query_engine(llm=Settings.llm)
        summary_query_engine = summary_index.as_query_engine(llm=Settings.llm)

        # define tools
        query_engine_tools = [
            QueryEngineTool(
                query_engine=vector_query_engine,
                metadata=ToolMetadata(
                    name="vector_tool",
                    description=(
                        "Useful for questions related to specific aspects of"
                        f" {country}."
                    ),
                ),
            ),
            QueryEngineTool(
                query_engine=summary_query_engine,
                metadata=ToolMetadata(
                    name="summary_tool",
                    description=(
                        "Useful for any requests that require a holistic summary"
                        f" of Nationally Determined Contributions (NDCs) about {country}. For questions about"
                        " more specific sections, please use the vector_tool."
                    ),
                ),
            ),
        ]

        # build agent
        function_llm = OpenAI(model=llm_model)
        agent = OpenAIAgent.from_tools(
            query_engine_tools,
            llm=function_llm,
            verbose=True,
            system_prompt=f"""\
    You are a specialized agent designed to answer queries about {country}.
    You must ALWAYS use at least one of the tools provided when answering a question; do NOT rely on prior knowledge.\
    """,
        )

        agents[country] = agent
        logging.info(f"Agent for {country} added.")
        query_engines[country] = vector_index.as_query_engine(similarity_top_k=2)
        logging.info(f"Query engine for {country} added.")


def init_ndc_comparison_agents(selected_countries):
    global agents, query_engines
    """Query the NDC agents for the selected countries."""
    # Ensure the data is loaded
    # if not agents or not query_engines:
    #     load_ndc_data()

    # define tool for each document agent
    all_tools = []
    for country in selected_countries:
        if country in agents:
            country_summary = (
                f"This content contains Nationally Determined Contribution for {country}. Use"
                f" this tool if you want to answer any questions about {country}.\n"
            )
            doc_tool = QueryEngineTool(
                query_engine=agents[country],
                metadata=ToolMetadata(
                    name=f"tool_{country}",
                    description=country_summary,
                ),
            )
            all_tools.append(doc_tool)

    # define an "object" index and retriever over these tools
    obj_index = ObjectIndex.from_objects(
        all_tools,
        index_cls=VectorStoreIndex,
    )

    top_agent = OpenAIAgent.from_tools(
        tool_retriever=obj_index.as_retriever(similarity_top_k=3),
        system_prompt=""" \
You are an agent designed to answer queries about a set of given countries Nationally Determined Contributions.
Please always use the tools provided to answer a question. Do not rely on prior knowledge.""",
        verbose=True,
    )

    return top_agent
