## Quick Start

### Frontend

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`.

### Backend

```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

Runs at `http://localhost:8000`.

---

This project went through four phases:

1. **Node Abstraction** — Created a reusable BaseNode component so new node types can be added quickly
2. **Styling** — Applied a clean VectorShift-inspired design with light theme
3. **Text Node Logic** — Added auto-resizing text area and dynamic handles for `{{variables}}`
4. **Backend Integration** — Connected the frontend to a validation API that checks for cycles

---

## Phase 1: Node Abstraction

### The Problem

Each node type (Input, Output, LLM, Text) was its own component with duplicated code. Every node had to define its own header rendering, ID bar, form fields, and connection handles. Adding a new node meant copying an existing file and rewriting most of the code.

### The Solution I Adopted

Created a `BaseNode` component that handles all the shared structure. New nodes just define a configuration and their form fields:

```jsx
// Define the config once
const myConfig = {
  nodeType: 'My Node',
  headerColor: 'var(--node-llm-header)',
  icon: Sparkles,
  inputs: [{ id: 'input', label: 'Input' }],
  outputs: [{ id: 'output', label: 'Output' }],
};

// Use BaseNode and add your fields
export const MyNode = ({ id, data }) => {
  return (
    <BaseNode id={id} data={data} config={myConfig}>
      <NodeField label="Field 1">
        <NodeInput value={...} />
      </NodeField>
    </BaseNode>
  );
};
```

### Config Options

| Property      | Type             | Description                    |
| ------------- | ---------------- | ------------------------------ |
| `nodeType`    | string           | Label shown in the header      |
| `headerColor` | CSS variable     | Background color for the icon  |
| `icon`        | Lucide component | Icon displayed in header       |
| `inputs`      | array            | Connection points on the left  |
| `outputs`     | array            | Connection points on the right |
| `minWidth`    | number           | Minimum node width in pixels   |

### Nodes Available

**Original 4:**

- Input — Feeds data into the pipeline
- Output — Collects data from the pipeline
- LLM — Connects to a language model (GPT-4o, Claude, etc.)
- Text — Text processing with variable support

**Additional 5:**

- API Request — Make HTTP calls with configurable method/URL/headers
- Condition — Branch the pipeline based on a comparison
- Transform — Apply string transformations (uppercase, trim, JSON parse, etc.)
- Note — Add comments and documentation
- Vector Search — Find similar items in a vector database

---

## Phase 2: Styling

### Design Choices

The UI was styled to match VectorShift's clean aesthetic I made an agent to scape the VectorShift website and extract design tokens. The main features are:

- **Light canvas** — Subtle blue-gray background with dotted grid pattern
- **White node cards** — Clean bodies with pale blue headers
- **Purple accents** — Primary color for edges, buttons, and active states
- **Compact toolbar** — Search box and draggable node cards at the top

### Key Visual Elements

**Palette Cards (80x80px):**

- Square cards with icon and label
- Icon shown in the node's accent color
- Hover lifts the card with blue border

**Node Cards:**

- White body with pale blue header
- Colored icon in the header (green=Input, purple=LLM, yellow=Output, etc.)
- Internal ID bar showing short name like `input_1`
- Form fields with consistent padding and borders

**Edges:**

- Purple dashed lines (7px dash, 7px gap)
- Subtle animation showing data flow direction
- Circular handles with purple borders

### CSS Structure

Design tokens are in `frontend/src/tokens.css`:

```css
:root {
    /* Backgrounds */
    --bg-primary: #ffffff;
    --bg-canvas: #fbfdff;
    --bg-soft: #f6f7fb;

    /* Text */
    --ink: #121826;
    --muted: #667085;

    /* Accents */
    --blue: #635bff;
    --blue-soft: #eef1ff;

    /* Node colors */
    --node-input: #10b981;
    --node-llm: #8b5cf6;
    --node-output: #f59e0b;
    /* ... and more */
}
```

---

## Phase 3: Text Node Logic

### Auto-resizing Text Area

The text area grows as you type more content. Uses a `useEffect` that adjusts height after every keystroke:

```jsx
useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.max(textarea.scrollHeight, 56)}px`;
    }
}, [value]);
```

### Dynamic Handles for Variables

Type `{{variable_name}}` in the text field and the node automatically creates an input handle on the left side. This lets you wire up other nodes directly into your text.

Example: If you have an Input node named `user_name`, type:

```
Hello, {{user_name}}! How can I help you today?
```

A handle labeled "user_name" appears on the left side of the Text node, ready to be connected.

The regex `/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g` extracts variable names from the text.

---

## Phase 4: Backend Integration

### The Endpoint

**POST `/pipelines/parse`**

Send your nodes and edges, get back statistics and validation status:

```json
// Request
{ "nodes": [...], "edges": [...] }

// Response
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true,
  "warning": null
}
```

### DAG Validation (Kahn's Algorithm)

The backend checks for cycles using Kahn's algorithm:

1. Build a graph from nodes and edges
2. Find all nodes with no incoming edges
3. Remove them and reduce in-degrees of their neighbors
4. Repeat until no nodes remain
5. If all nodes get removed, there are no cycles → valid DAG
6. If some nodes remain, there's a cycle → invalid

### Frontend Flow

1. Click "Validate Pipeline"
2. Frontend sends nodes and edges to backend
3. Loading spinner appears
4. Modal shows results:
    - Node and edge counts
    - Whether it's a valid DAG
    - Success or warning icon
    - Helpful message

If the backend isn't running, shows a connection error with instructions.

---

## Project Structure

```
frontend/
├── src/
│   ├── nodes/
│   │   ├── BaseNode.js      # Shared node shell
│   │   ├── inputNode.js     # Input node
│   │   ├── outputNode.js    # Output node
│   │   ├── llmNode.js       # LLM node
│   │   ├── textNode.js      # Text with variable support
│   │   ├── customNodes.js   # API, Condition, Transform, Note, Vector
│   │   └── index.js         # Exports all nodes
│   ├── toolbar.js           # Top navigation
│   ├── draggableNode.js     # Palette cards
│   ├── ui.js                # React Flow canvas
│   ├── submit.js            # Validation button + modal
│   ├── store.js             # Global state
│   ├── tokens.css           # Design tokens
│   ├── App.js               # Main component
│   └── index.js             # Entry point

backend/
└── main.py                  # FastAPI with DAG validation
```

---
