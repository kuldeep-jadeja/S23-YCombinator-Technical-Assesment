# 🔗 Pipeline Orchestrator

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/ReactFlow-11.11-FF6B6B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node-18+-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python" />
</p>

> A visual pipeline orchestration tool with drag-and-drop node creation, real-time DAG validation, and a clean dark-themed interface.

---

## ✨ Features

- **🎨 Visual Node Editor** — Drag-and-drop interface powered by ReactFlow
- **🔗 9 Node Types** — Input, LLM, Output, Text, API Request, Conditional, Transform, Note, Vector Search
- **⚡ Real-time DAG Validation** — Instantly validates pipeline structure via Kahn's algorithm
- **🌙 Dark Theme UI** — Modern, high-contrast design with syntax-highlighted code elements
- **📊 Live Stats** — Node/edge count displayed in real-time
- **🔄 Smooth Animations** — Animated edge connections between nodes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Toolbar    │  │  PipelineUI │  │  SubmitButton           │  │
│  │  (Drag src) │  │  (ReactFlow)│  │  (Validate Pipeline)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                            │                                    │
│                            │ POST /pipelines/parse              │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (FastAPI)                       │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  GET /              │  │  POST /pipelines/parse          │   │
│  │  Health check       │  │  DAG validation (Kahn's algo)   │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Node Types

| Node | Icon | Color | Description |
|------|------|-------|-------------|
| **Input** | → | `#10b981` | Defines pipeline input sources (Text, File, Image, Number) |
| **LLM** | ✦ | `#8b5cf6` | Connects to large language models (GPT-4o, Claude, Gemini) |
| **Output** | ← | `#f59e0b` | Defines pipeline output sinks |
| **Text** | T | `#06b6d4` | Static text with `{{variable}}` interpolation |
| **API Request** | ⇄ | `#f43f5e` | HTTP requests (GET, POST, PUT, PATCH, DELETE) |
| **Conditional** | ⟁ | `#ec4899` | Branch logic (equals, contains, gt, lt, is_empty) |
| **Transform** | ⟳ | `#14b8a6` | Data transformation (uppercase, JSON parse/stringify) |
| **Note** | ✎ | `#eab308` | Annotations and documentation |
| **Vector Search** | ◈ | `#a855f7` | Semantic search configuration (cosine, euclidean, dot) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **pip** (Python package manager)

### 1. Clone & Setup

```bash
# Frontend
cd frontend
npm install

# Backend (in a virtual environment recommended)
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn
```

### 2. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

### 3. Open in Browser

```
http://localhost:3000
```

---

## 🎯 Usage Guide

### Creating a Pipeline

1. **Drag nodes** from the toolbar at the top
2. **Connect nodes** by dragging from output handle to input handle
3. **Configure nodes** by clicking and editing fields
4. **Validate** by clicking the "⬡ Validate Pipeline" button

### Node Configuration

#### Text Node — Variable Interpolation
```
{{user_input}} — creates dynamic input handle
```
Variables are automatically extracted and displayed as connection handles.

#### Conditional Node
Supports operators: `equals`, `not_equals`, `contains`, `gt`, `lt`, `is_empty`

#### Transform Node
Operations: `uppercase`, `lowercase`, `trim`, `json_parse`, `json_stringify`, `custom (JS)`

---

## 🔌 API Reference

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "Ping": "Pong"
}
```

### `POST /pipelines/parse`
Validates the pipeline graph structure.

**Request Body:**
```json
{
  "nodes": [
    { "id": "customInput-1", "type": "customInput", "data": {...} }
  ],
  "edges": [
    { "source": "customInput-1", "target": "llm-1" }
  ]
}
```

**Response:**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `num_nodes` | int | Total number of nodes in the pipeline |
| `num_edges` | int | Total number of connections |
| `is_dag` | bool | `true` if the graph is a Directed Acyclic Graph |

---

## 📁 Project Structure

```
frontend_technical_assessment/
├── frontend/
│   ├── public/
│   │   └── manifest.json
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.js      # Core node component
│   │   │   ├── customNodes.js   # 5 custom nodes (API, Conditional, etc.)
│   │   │   ├── inputNode.js     # Input node
│   │   │   ├── llmNode.js       # LLM node
│   │   │   ├── outputNode.js    # Output node
│   │   │   └── textNode.js      # Text node with variable interpolation
│   │   ├── App.js               # Main app component
│   │   ├── draggableNode.js     # Toolbar drag source
│   │   ├── index.js             # React entry point
│   │   ├── store.js             # Zustand store (ID generation)
│   │   ├── submit.js            # Validation button & modal
│   │   ├── toolbar.js           # Node palette toolbar
│   │   └── ui.js                # ReactFlow canvas
│   ├── package.json
│   └── README.md
├── backend/
│   ├── main.py                  # FastAPI app with DAG validation
│   └── requirements.txt         # (optional) Python dependencies
├── SPEC.md
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | React | 18.2 |
| **Flow Editor** | ReactFlow | 11.11 |
| **State Management** | Zustand | 5.0 |
| **Build Tool** | Create React App | 5.0 |
| **Backend Framework** | FastAPI | 0.104+ |
| **Python Runtime** | Python | 3.11+ |
| **ASGI Server** | Uvicorn | Latest |

---

## 🎨 Screenshots

> Visual preview of the pipeline editor with connected nodes

```
┌──────────────────────────────────────────────────────────────────┐
│  Pipeline Orchestrator                              [Toolbar]     │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│  │ Input  │ │  LLM   │ │  Text  │ │  API   │ │Vector  │         │
│  │  →     │ │  ✦     │ │  T     │ │  ⇄     │ │  ◈     │         │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│      ┌─────────────┐                    ┌─────────────┐         │
│      │   Input     │                    │    LLM      │         │
│      │   node_1    │ ──────────────────▶│  gpt-4o     │         │
│      └─────────────┘                    └─────────────┘         │
│                                                │                │
│                                                ▼                │
│                                        ┌─────────────┐          │
│                                        │   Output    │          │
│                                        │  output_1   │          │
│                                        └─────────────┘          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Nodes: 3  │  Edges: 2  │         ⬡ Validate Pipeline            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Validation Logic

The backend uses **Kahn's Algorithm** for topological sorting:

1. Calculate in-degree for each node
2. Queue nodes with in-degree = 0
3. Process queue, decrementing neighbor in-degrees
4. If all nodes visited → **DAG is valid**
5. If cycles remain → **Not a DAG**

---

## 📝 License

MIT License — feel free to use and modify.

---

<p align="center">
  Built with ❤️ using React + FastAPI
</p>