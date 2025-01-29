import os

import streamlit as st
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

os.environ["OPENAI_API_KEY"] = st.secrets["OPENAI_API_KEY"]


def multi_document_agents():
    """NDCs from: https://unfccc.int/NDCREG
    Code Adapted from: https://docs.llamaindex.ai/en/stable/examples/agent/multi_document_agents/
    """
    Settings.llm = OpenAI(temperature=0, model="gpt-4o-mini")
    Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

    node_parser = SentenceSplitter()

    # Build agents dictionary
    agents = {}
    query_engines = {}

    ndc_file_name_path_mapping = {
        "Brunei": "data/ndc/Brunei Darussalam's NDC 2020.pdf",
        "Cambodia": "data/ndc/20201231_NDC_Update_Cambodia.pdf",
        "Indonesia": "data/ndc/ENDC Indonesia.pdf",
        "Laos": "data/ndc/NDC 2020 of Lao PDR (English), 09 April 2021 (1).pdf",
        "Malaysia": "data/ndc/Malaysia NDC Updated Submission to UNFCCC July 2021 final.pdf",
        "Myanmar": "data/ndc/Myanmar Updated  NDC July 2021.pdf",
        "Singapore": "data/ndc/Singapore Second Update of First NDC.pdf",
        "Vietnam": "data/ndc/Viet Nam NDC 2022 Update.pdf",
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
        function_llm = OpenAI(model="gpt-4o-mini")
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
        query_engines[country] = vector_index.as_query_engine(similarity_top_k=2)

    # define tool for each document agent
    all_tools = []
    for country in sea_countries:
        country_summary = (
            f"This content contains Nationally Determined Contributions for {country}. Use"
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
You are an agent designed to answer queries about a set of given South East Asia countries.
Please always use the tools provided to answer a question. Do not rely on prior knowledge.""",
        verbose=True,
    )

    return top_agent
