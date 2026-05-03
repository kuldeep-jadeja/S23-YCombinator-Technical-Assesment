# main.py — FastAPI backend for pipeline validation
# Accepts node/edge data and checks if the pipeline forms a valid DAG
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional

app = FastAPI()

# Allow requests from all development and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    """Nodes and edges that make up a pipeline"""
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]


class PipelineResponse(BaseModel):
    """Response with pipeline statistics"""
    num_nodes: int
    num_edges: int
    is_dag: bool
    warning: Optional[str] = None


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse", response_model=PipelineResponse)
def parse_pipeline(pipeline: Pipeline):
    """
    Validate a pipeline and return statistics.
    Counts nodes and edges, then checks if the graph is acyclic.
    """
    nodes = pipeline.nodes
    edges = pipeline.edges

    num_nodes = len(nodes)
    num_edges = len(edges)

    # Handle empty pipeline
    if num_nodes == 0:
        return PipelineResponse(
            num_nodes=0,
            num_edges=0,
            is_dag=True,
            warning="Empty pipeline — add nodes to build your workflow"
        )

    # Check if this forms a valid DAG (no cycles)
    dag = is_dag(nodes, edges)

    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=dag,
        warning=None if dag else "Pipeline contains a cycle — fix circular connections"
    )


def is_dag(nodes: list[dict], edges: list[dict]) -> bool:
    """
    Check if the graph is a Directed Acyclic Graph using Kahn's algorithm.
    Returns True if the graph has no cycles, False otherwise.
    """
    if not nodes:
        return True  # Empty graph is technically a DAG

    node_ids = {n["id"] for n in nodes}

    # Build adjacency list and in-degree map
    adj: dict[str, list[str]] = {nid: [] for nid in node_ids}
    in_degree: dict[str, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        # Only count edges between known nodes
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # Kahn's BFS — start with nodes that have no incoming edges
    queue = [nid for nid, deg in in_degree.items() if deg == 0]
    visited = 0

    while queue:
        node = queue.pop(0)
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we visited all nodes, there's no cycle → it's a DAG
    return visited == len(node_ids)