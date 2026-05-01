// llmNode.js
import { useState } from 'react';
import { BaseNode, NodeField, NodeSelect } from './BaseNode';

const config = {
  nodeType: 'LLM',
  headerColor: '#8b5cf6',
  icon: '✦',
  inputs: [
    { id: 'system', label: 'system' },
    { id: 'prompt', label: 'prompt' },
  ],
  outputs: [{ id: 'response', label: 'response' }],
};

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');

  return (
    <BaseNode id={id} data={data} config={config}>
      <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5, marginBottom: 'var(--space-4)' }}>
        Large Language Model node. Connect a system prompt and user prompt to generate a response.
      </div>
      <NodeField label="Model">
        <NodeSelect value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o mini</option>
          <option value="claude-opus-4">Claude Opus 4</option>
          <option value="claude-sonnet-4">Claude Sonnet 4</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
        </NodeSelect>
      </NodeField>
    </BaseNode>
  );
};
