// inputNode.js — Starting point node that feeds data into the pipeline
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BaseNode, NodeField, NodeInput, NodeSelect } from './BaseNode';

// Configuration for the Input node
const config = {
  nodeType: 'Input',
  headerColor: 'var(--node-input-header)',
  icon: ArrowRight,
  inputs: [],
  outputs: [{ id: 'value', label: 'Value' }],
};

export const InputNode = ({ id, data }) => {
  // Use a friendly name like "input_1" instead of the internal React Flow ID
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode id={id} data={data} config={config}>
      <NodeField label="Name">
        <NodeInput
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="input_name"
        />
      </NodeField>
      <NodeField label="Type">
        <NodeSelect value={inputType} onChange={(e) => setInputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
          <option value="Image">Image</option>
          <option value="Number">Number</option>
        </NodeSelect>
      </NodeField>
    </BaseNode>
  );
};