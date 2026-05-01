// customNodes.js — 5 new nodes built with BaseNode abstraction
import { useState } from 'react';
import { BaseNode, NodeField, NodeInput, NodeSelect, NodeTextarea } from './BaseNode';

// ─── 1. API Request Node ─────────────────────────────────────────────────────
const apiConfig = {
  nodeType: 'API Request',
  headerColor: '#f43f5e',
  icon: '⇄',
  inputs: [
    { id: 'url', label: 'url' },
    { id: 'body', label: 'body' },
  ],
  outputs: [
    { id: 'response', label: 'response' },
    { id: 'status', label: 'status' },
  ],
};

export const APIRequestNode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [headers, setHeaders] = useState(data?.headers || '');

  return (
    <BaseNode id={id} data={data} config={apiConfig}>
      <NodeField label="Method">
        <NodeSelect value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </NodeSelect>
      </NodeField>
      <NodeField label="Headers (JSON)">
        <NodeTextarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder={'{"Authorization": "Bearer ..."}'}
          style={{ minHeight: 'var(--space-11)', resize: 'none' }}
        />
      </NodeField>
    </BaseNode>
  );
};

// ─── 2. Conditional / Router Node ────────────────────────────────────────────
const conditionalConfig = {
  nodeType: 'Condition',
  headerColor: '#ec4899',
  icon: '⟁',
  inputs: [{ id: 'value', label: 'value' }],
  outputs: [
    { id: 'true', label: 'true' },
    { id: 'false', label: 'false' },
  ],
};

export const ConditionalNode = ({ id, data }) => {
  const [operator, setOperator] = useState(data?.operator || 'equals');
  const [compareValue, setCompareValue] = useState(data?.compareValue || '');

  return (
    <BaseNode id={id} data={data} config={conditionalConfig}>
      <NodeField label="Operator">
        <NodeSelect value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option value="equals">Equals</option>
          <option value="not_equals">Not equals</option>
          <option value="contains">Contains</option>
          <option value="gt">Greater than</option>
          <option value="lt">Less than</option>
          <option value="is_empty">Is empty</option>
        </NodeSelect>
      </NodeField>
      <NodeField label="Compare value">
        <NodeInput
          type="text"
          value={compareValue}
          onChange={(e) => setCompareValue(e.target.value)}
          placeholder="value to compare"
        />
      </NodeField>
    </BaseNode>
  );
};

// ─── 3. Data Transform Node ───────────────────────────────────────────────────
const transformConfig = {
  nodeType: 'Transform',
  headerColor: '#14b8a6',
  icon: '⟳',
  inputs: [{ id: 'input', label: 'input' }],
  outputs: [{ id: 'output', label: 'output' }],
};

export const TransformNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'uppercase');
  const [customCode, setCustomCode] = useState(data?.customCode || '');

  return (
    <BaseNode id={id} data={data} config={transformConfig}>
      <NodeField label="Operation">
        <NodeSelect value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="trim">Trim whitespace</option>
          <option value="json_parse">JSON parse</option>
          <option value="json_stringify">JSON stringify</option>
          <option value="custom">Custom (JS)</option>
        </NodeSelect>
      </NodeField>
      {operation === 'custom' && (
        <NodeField label="Custom expression">
          <NodeTextarea
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="(input) => input.trim()"
            style={{ minHeight: 'var(--space-12)', fontFamily: 'var(--font-body)' }}
          />
        </NodeField>
      )}
    </BaseNode>
  );
};

// ─── 4. Note / Comment Node ───────────────────────────────────────────────────
const noteConfig = {
  nodeType: 'Note',
  headerColor: '#eab308',
  icon: '✎',
  inputs: [],
  outputs: [],
  minWidth: 180,
};

export const NoteNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || 'Add a note...');

  return (
    <BaseNode id={id} data={data} config={noteConfig}>
      <NodeTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Annotate your pipeline..."
        style={{ minHeight: 'var(--space-13)', color: '#facc15', borderColor: '#eab30844', background: '#eab30808' }}
      />
    </BaseNode>
  );
};

// ─── 5. Vector Search Node ────────────────────────────────────────────────────
const vectorConfig = {
  nodeType: 'Vector Search',
  headerColor: '#a855f7',
  icon: '◈',
  inputs: [
    { id: 'query', label: 'query' },
    { id: 'index', label: 'index' },
  ],
  outputs: [
    { id: 'results', label: 'results' },
    { id: 'scores', label: 'scores' },
  ],
};

export const VectorSearchNode = ({ id, data }) => {
  const [topK, setTopK] = useState(data?.topK || '5');
  const [metric, setMetric] = useState(data?.metric || 'cosine');
  const [threshold, setThreshold] = useState(data?.threshold || '0.7');

  return (
    <BaseNode id={id} data={data} config={vectorConfig}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <NodeField label="Top K">
          <NodeInput
            type="number"
            value={topK}
            min={1}
            max={100}
            onChange={(e) => setTopK(e.target.value)}
          />
        </NodeField>
        <NodeField label="Threshold">
          <NodeInput
            type="number"
            value={threshold}
            step="0.05"
            min={0}
            max={1}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </NodeField>
      </div>
      <NodeField label="Similarity metric">
        <NodeSelect value={metric} onChange={(e) => setMetric(e.target.value)}>
          <option value="cosine">Cosine</option>
          <option value="euclidean">Euclidean</option>
          <option value="dot">Dot product</option>
        </NodeSelect>
      </NodeField>
    </BaseNode>
  );
};
