// customNodes.js — 5 new nodes built with BaseNode abstraction
import { useState } from 'react';
import { ArrowLeftRight, GitBranch, RefreshCw, StickyNote, Database } from 'lucide-react';
import { BaseNode, NodeField, NodeInput, NodeSelect, AutoResizeTextarea } from './BaseNode';

// ─── 1. API Request Node ─────────────────────────────────────────────────────
const apiConfig = {
  nodeType: 'API Request',
  headerColor: 'var(--node-api-header)',
  icon: ArrowLeftRight,
  inputs: [
    { id: 'url', label: 'URL' },
    { id: 'body', label: 'Body' },
  ],
  outputs: [
    { id: 'response', label: 'Response' },
    { id: 'status', label: 'Status' },
  ],
};

export const APIRequestNode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || '');
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
      <NodeField label="URL">
        <NodeInput
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
      </NodeField>
      <NodeField label="Headers (JSON)">
        <AutoResizeTextarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Authorization": "Bearer ..."}'
        />
      </NodeField>
    </BaseNode>
  );
};

// ─── 2. Conditional / Router Node ────────────────────────────────────────────
const conditionalConfig = {
  nodeType: 'Condition',
  headerColor: 'var(--node-conditional-header)',
  icon: GitBranch,
  inputs: [{ id: 'value', label: 'Value' }],
  outputs: [
    { id: 'true', label: 'True' },
    { id: 'false', label: 'False' },
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
  headerColor: 'var(--node-transform-header)',
  icon: RefreshCw,
  inputs: [{ id: 'input', label: 'Input' }],
  outputs: [{ id: 'output', label: 'Output' }],
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
          <AutoResizeTextarea
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="(input) => input.trim()"
          />
        </NodeField>
      )}
    </BaseNode>
  );
};

// ─── 4. Note / Comment Node ───────────────────────────────────────────────────
const noteConfig = {
  nodeType: 'Note',
  headerColor: 'var(--node-note-header)',
  icon: StickyNote,
  inputs: [],
  outputs: [],
  minWidth: 200,
};

export const NoteNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '');

  return (
    <BaseNode id={id} data={data} config={noteConfig}>
      <AutoResizeTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a note to your pipeline..."
        style={{
          color: 'var(--node-note-header)',
          background: 'var(--node-note-bg)',
          borderColor: 'var(--node-note)',
        }}
      />
    </BaseNode>
  );
};

// ─── 5. Vector Search Node ────────────────────────────────────────────────────
const vectorConfig = {
  nodeType: 'Vector Search',
  headerColor: 'var(--node-vector-header)',
  icon: Database,
  inputs: [
    { id: 'query', label: 'Query' },
    { id: 'index', label: 'Index' },
  ],
  outputs: [
    { id: 'results', label: 'Results' },
    { id: 'scores', label: 'Scores' },
  ],
};

export const VectorSearchNode = ({ id, data }) => {
  const [topK, setTopK] = useState(data?.topK || '5');
  const [metric, setMetric] = useState(data?.metric || 'cosine');
  const [threshold, setThreshold] = useState(data?.threshold || '0.7');
  const [indexName, setIndexName] = useState(data?.indexName || '');

  return (
    <BaseNode id={id} data={data} config={vectorConfig}>
      <NodeField label="Index name">
        <NodeInput
          type="text"
          value={indexName}
          onChange={(e) => setIndexName(e.target.value)}
          placeholder="my-vector-index"
        />
      </NodeField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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