# Technical Assessment - Pipeline Builder

## Overview

This project implements a visual pipeline editor with node abstraction, styling system, dynamic text logic, and backend integration. Built with React (frontend) and FastAPI (backend).

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.js       # Node abstraction layer
│   │   │   ├── inputNode.js       # Input node (user-defined)
│   │   │   ├── outputNode.js      # Output node (user-defined)
│   │   │   ├── llmNode.js         # LLM node (user-defined)
│   │   │   ├── textNode.js        # Text node with {{variable}} handles
│   │   │   └── customNodes.js     # 5 additional node types
│   │   ├── App.js
│   │   ├── ui.js                  # ReactFlow canvas
│   │   ├── store.js               # Zustand state management
│   │   ├── toolbar.js             # Node palette
│   │   ├── submit.js              # Backend submission
│   │   ├── draggableNode.js       # Draggable toolbar items
│   │   ├── tokens.css             # Design system tokens
│   │   └── index.js               # Entry point
│   └── package.json
│
└── backend/
    └── main.py                    # FastAPI server with DAG validation
```

## Part 1: Node Abstraction

### Architecture

The node system uses a **config-driven composition pattern**:

1. **BaseNode** (`nodes/BaseNode.js`) - Reusable container with:
   - Decorative handles (input/output points)
   - Styled header with icon and label
   - Form body for child content
   - Exported field components: `NodeField`, `NodeInput`, `NodeSelect`, `NodeTextarea`

2. **Node Config** - Declarative configuration object:
   ```js
   const config = {
     nodeType: 'Node Name',       // Header text
     headerColor: '#hex',         // Accent color
     icon: '✦',                   // Header icon
     minWidth: 220,               // Minimum width
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

### Node Registration

Nodes are registered in `ui.js`:
```js
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  apiRequest: APIRequestNode,
  conditional: ConditionalNode,
  transform: TransformNode,
  note: NoteNode,
  vectorSearch: VectorSearchNode,
};
```

Toolbar items defined in `toolbar.js` with type, label, color, and icon.

### Implemented Nodes

| Node Type | File | Description |
|-----------|------|-------------|
| Input | `inputNode.js` | User input source with type selector |
| Output | `outputNode.js` | Pipeline output destination |
| LLM | `llmNode.js` | Language model with model selector |
| Text | `textNode.js` | Text content with {{variable}} handles |
| API Request | `customNodes.js` | HTTP request with method/headers |
| Conditional | `customNodes.js` | Branch logic with operators |
| Transform | `customNodes.js` | Data transformation operations |
| Note | `customNodes.js` | Annotation/comments |
| Vector Search | `customNodes.js` | Similarity search with metrics |

## Part 2: Styling

### Design Tokens (`tokens.css`)

```css
:root {
  --font-heading: Studio Feixen Sans Medium;
  --font-body: Studio Feixen Sans Medium;
  --space-1: 1px;     --space-2: 1.2px;   --space-3: 2px;
  --space-4: 4.4px;   --space-5: 6px;      --space-6: 8px;
  --space-7: 9px;     --space-8: 11.8px;   --space-9: 16px;
  --space-10: 20px;   --space-11: 24px;    --space-12: 32px;
  --space-13: 40px;   --space-14: 64px;    --space-15: 80px;
  --space-16: 88px;
}
```

### Usage Patterns

- Font families: `fontFamily: 'var(--font-body)'`
- Spacing: `padding: 'var(--space-9)'`, `gap: 'var(--space-6)'`
- Heights calculated from tokens: `height: 'var(--space-15)'`

### Design System Features

- Dark theme with `#080c12` background
- Accent colors per node type (indigo, emerald, amber, etc.)
- Consistent border radius (6-10px)
- Subtle shadows and hover states

## Part 3: Text Node Logic

### Dynamic Resizing

Text node (`textNode.js`) auto-resizes based on content:

```js
// Auto-resize textarea
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

Variables defined with `{{variableName}}` syntax:

```js
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

// Extract unique variable names
const variables = [...new Set([...currText.matchAll(VARIABLE_REGEX)].map(m => m[1]))];
```

Each variable creates a left-side Handle for connection.

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

Response displays in a modal showing:
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
def is_dag(nodes, edges) -> bool:
    node_ids = {n["id"] for n in nodes}
    adj = {nid: [] for nid in node_ids}
    in_degree = {nid: 0 for nid in node_ids}

    for edge in edges:
        if edge["source"] in node_ids and edge["target"] in node_ids:
            adj[edge["source"]].append(edge["target"])
            in_degree[edge["target"]] += 1

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