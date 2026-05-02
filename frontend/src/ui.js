// ui.js — Claude-styled ReactFlow pipeline canvas (light mode)
import { useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useReactFlow, ReactFlowProvider, applyNodeChanges, applyEdgeChanges } from 'reactflow';

import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import {
  APIRequestNode,
  ConditionalNode,
  TransformNode,
  NoteNode,
  VectorSearchNode,
} from './nodes/customNodes';
import { useStore } from './store';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

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

// Node color map for MiniMap
const nodeColorMap = {
  customInput: '#5db8a6',
  llm: '#cc785c',
  customOutput: '#e8a55a',
  text: '#6c6a64',
  apiRequest: '#c64545',
  conditional: '#d4a017',
  transform: '#5db872',
  note: '#e8a55a',
  vectorSearch: '#3d3d3a',
};

// Inner component — must be inside ReactFlowProvider to use useReactFlow()
const Flow = ({ nodes, setNodes, edges, setEdges }) => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const getNodeID = useStore((state) => state.getNodeID);

  const activeNodes = nodes;
  const activeEdges = edges;
  const activeSetNodes = setNodes;
  const activeSetEdges = setEdges;

  const onNodesChange = useCallback(
    (changes) => activeSetNodes((nds) => applyNodeChanges(changes, nds)),
    [activeSetNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => activeSetEdges((eds) => applyEdgeChanges(changes, eds)),
    [activeSetEdges]
  );

  const onConnect = useCallback(
    (connection) =>
      activeSetEdges((eds) =>
        eds.concat({
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: 'arrowclosed', height: 16, width: 16, color: '#cc785c' },
          style: { stroke: '#cc785c', strokeWidth: 2 },
        })
      ),
    [activeSetEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event?.dataTransfer?.getData('application/reactflow');
      if (!raw) return;
      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeID = getNodeID(type);
      activeSetNodes((nds) => [
        ...nds,
        { id: nodeID, type, position, data: { id: nodeID, nodeType: type } },
      ]);
    },
    [screenToFlowPosition, getNodeID, activeSetNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ flex: 1, width: '100vw' }}
    >
      <ReactFlow
        nodes={activeNodes}
        edges={activeEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        defaultEdgeOptions={{
          style: { stroke: '#cc785c', strokeWidth: 2 },
          animated: true,
        }}
      >
        {/* Dot grid pattern */}
        <Background color="#e6dfd8" gap={gridSize} variant="dots" size={1.5} />
        <Controls />
        <MiniMap
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
          }}
          nodeColor={(node) => nodeColorMap[node.type] || '#cc785c'}
          maskColor="rgba(250, 249, 245, 0.8)"
        />
      </ReactFlow>
    </div>
  );
};

// Wrap in ReactFlowProvider so useReactFlow() works inside Flow
export const PipelineUI = ({ nodes, setNodes, edges, setEdges }) => (
  <ReactFlowProvider>
    <Flow nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
  </ReactFlowProvider>
);
