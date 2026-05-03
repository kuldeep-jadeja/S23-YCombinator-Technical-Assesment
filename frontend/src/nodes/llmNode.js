// llmNode.js — Large language model node for AI completions
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { BaseNode, NodeField, NodeSelect, AutoResizeTextarea } from './BaseNode';

// Configuration for the LLM node
const config = {
  nodeType: 'LLM',
  headerColor: 'var(--node-llm-header)',
  icon: Sparkles,
  inputs: [
    { id: 'system', label: 'System' },
    { id: 'prompt', label: 'Prompt' },
  ],
  outputs: [{ id: 'response', label: 'Response' }],
};

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState(data?.systemPrompt || '');

  return (
    <BaseNode id={id} data={data} config={config}>
      <NodeField label="Model">
        <NodeSelect value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o mini</option>
          <option value="claude-opus-4">Claude Opus 4</option>
          <option value="claude-sonnet-4">Claude Sonnet 4</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
        </NodeSelect>
      </NodeField>
      <NodeField label="System prompt">
        <AutoResizeTextarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
        />
      </NodeField>
    </BaseNode>
  );
};