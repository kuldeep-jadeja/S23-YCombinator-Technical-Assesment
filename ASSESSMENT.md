# Technical Assessment - Pipeline Builder

## Overview

This project implements a visual pipeline editor with node abstraction, styling system, dynamic text logic, and backend integration. Built with React (frontend) and FastAPI (backend).

The UI is styled to match VectorShift's design language: dark purple theme, two-toned nodes (solid header + translucent body), and a cohesive color system.

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.js       # Node abstraction layer
│   │   │   ├── inputNode.js      # Input node
│   │   │   ├── outputNode.js     # Output node
│   │   │   ├── llmNode.js       # LLM node
│   │   │   ├── textNode.js      # Text node with {{variable}} handles
│   │   │   └── customNodes.js    # 5 additional node types
│   │   ├── App.js
│   │   ├── ui.js                # ReactFlow canvas
│   │   ├── store.js             # Zustand state management
│   │   ├── toolbar.js           # Node palette
│   │   ├── submit.js            # Backend submission
│   │   ├── draggableNode.js     # Draggable toolbar items
│   │   ├── tokens.css          # Design system tokens
│   │   └── index.js            # Entry point
│   └── package.json
│
└── backend/
    └── main.py                  # FastAPI server with DAG validation
```

## Part 1: Node Abstraction

### Architecture

The node system uses a **config-driven composition pattern**:

1. **BaseNode** (`nodes/BaseNode.js`) - Reusable container with:
   - Two-toned design: solid gradient header + translucent body
   - Input/output handles with labels
   - Exported field components: `NodeField`, `NodeInput`, `NodeSelect`, `NodeTextarea`

2. **Node Config** - Declarative configuration object:
   ```js
   const config = {
     nodeType: 'Node Name',       // Header text
     headerColor: '#8b5cf6',     // Accent color for gradient header
     icon: '✦',                   // Header icon
     minWidth: 220,              // Minimum width
     inputs: [{ id, label }],     // Left-side handles
     outputs: [{ id, label }],    // Right-side handles
   };
   ```

3. **Component** - React component using BaseNode:
   ```js
   export const CustomNode = ({ id, data }) => (
     <BaseNode id={id} data={data} config={config}>
       <NodeField label="Field">
         <NodeInput ... />
       </NodeField>
     </BaseNode>
   );
   ```

### Implemented Nodes

| Node Type | Color | Description |
|-----------|-------|-------------|
| Input | `#10b981` (Emerald) | User input source with type selector |
| Output | `#f59e0b` (Amber) | Pipeline output destination |
| LLM | `#8b5cf6` (Violet) | Language model with model selector |
| Text | `#06b6d4` (Cyan) | Text content with {{variable}} handles |
| API Request | `#f43f5e` (Rose) | HTTP request with method/headers |
| Conditional | `#ec4899` (Pink) | Branch logic with operators |
| Transform | `#14b8a6` (Teal) | Data transformation operations |
| Note | `#eab308` (Yellow) | Annotation/comments |
| Vector Search | `#a855f7` (Purple) | Similarity search with metrics |

## Part 2: Styling (VectorShift-Inspired)

### Design Tokens (`tokens.css`)

```css
:root {
  /* Font Families */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Core Colors */
  --bg-primary: #0a0a12;
  --bg-secondary: #12121a;
  --bg-tertiary: #1a1a24;
  --bg-elevated: #1e1e2a;

  /* Node Colors */
  --node-border: rgba(139, 92, 246, 0.2);

  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.4);

  /* Accent */
  --accent-primary: #7c3aed;

  /* Shadows */
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px rgba(124, 58, 237, 0.3);

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
}
```

### Key Design Patterns

**Two-Toned Nodes:**
- Solid gradient header (`linear-gradient`) in node accent color
- Translucent body (`${headerColor}0d` ~ 5% opacity)
- Subtle border in accent color at 20% opacity

**Toolbar:**
- Dark secondary background
- Left accent border on node items
- Hover states with color tinting

**Edges:**
- Purple stroke (`#8b5cf6`) with smoothstep animation
- Dashed connection lines

## Part 3: Text Node Logic

### Dynamic Resizing

Text node (`textNode.js`) auto-resizes based on content:

```js
// Auto-resize textarea height
useEffect(() => {
  const ta = textareaRef.current;
  if (!ta) return;
  ta.style.height = 'auto';
  ta.style.height = `${ta.scrollHeight}px`;
}, [currText]);

// Dynamic width based on content
const longestLine = Math.max(...currText.split('\n').map(l => l.length), 10);
const dynamicWidth = Math.min(Math.max(longestLine * 7.5 + 60, 220), 520);
```

### Variable Handle Generation

Variables defined with `{{variableName}}` syntax create dynamic input handles:

```js
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

// Extract unique variable names
const variables = [...new Set([...currText.matchAll(VARIABLE_REGEX)].map(m => m[1]))];
```

Each variable creates a left-side Handle positioned dynamically along the node.

## Part 4: Backend Integration

### Frontend (`submit.js`)

Submit button sends pipeline data to backend:

```js
const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nodes, edges }),
});
```

Response displays in a VectorShift-styled modal showing:
- `num_nodes`: Total node count
- `num_edges`: Total edge count
- `is_dag`: Whether pipeline is a valid DAG

### Backend (`main.py`)

FastAPI endpoint `/pipelines/parse` returns:

```json
{
  "num_nodes": 5,
  "num_edges": 4,
  "is_dag": true
}
```

DAG validation uses **Kahn's algorithm** (BFS topological sort via in-degree counting):

```python
def is_dag(nodes: list[dict], edges: list[dict]) -> bool:
    node_ids = {n["id"] for n in nodes}
    adj = {nid: [] for nid in node_ids}
    in_degree = {nid: 0 for nid in node_ids}

    for edge in edges:
        src, tgt = edge.get("source"), edge.get("target")
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    queue = [nid for nid, deg in in_degree.items() if deg == 0]
    visited = 0
    while queue:
        node = queue.pop(0)
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)
```

## Running the Application

### Frontend
```bash
cd frontend
npm install
npm start        # Runs on http://localhost:3000
```

### Backend
```bash
cd backend
uvicorn main:app --reload   # Runs on http://localhost:8000
```

## Dependencies

### Frontend
- `react`, `react-dom`, `react-scripts`
- `reactflow` - Visual node editor
- `zustand` - State management

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
