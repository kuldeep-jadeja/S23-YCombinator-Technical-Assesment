// outputNode.js
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BaseNode, NodeField, NodeInput, NodeSelect } from './BaseNode';

const config = {
  nodeType: 'Output',
  headerColor: 'var(--node-output-header)',
  icon: ArrowLeft,
  inputs: [{ id: 'value', label: 'Value' }],
  outputs: [],
};

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode id={id} data={data} config={config}>
      <NodeField label="Name">
        <NodeInput
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="output_name"
        />
      </NodeField>
      <NodeField label="Type">
        <NodeSelect value={outputType} onChange={(e) => setOutputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="File">File</option>
        </NodeSelect>
      </NodeField>
    </BaseNode>
  );
};
