// ui.js — VectorShift-styled ReactFlow pipeline canvas (light mode)
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
  customInput: '#10b981',
  llm: '#8b5cf6',
  customOutput: '#f59e0b',
  text: '#0ea5e9',
  apiRequest: '#f43f5e',
  conditional: '#ec4899',
  transform: '#14b8a6',
  note: '#eab308',
  vectorSearch: '#a855f7',
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
          markerEnd: { type: 'arrowclosed', height: 16, width: 16, color: '#8b5cf6' },
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
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
      style={{ width: '100vw', height: 'calc(100vh - 56px - 52px)' }}
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
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          animated: true,
        }}
      >
        {/* Dot grid pattern */}
        <Background color="#e2e8f0" gap={gridSize} variant="dots" size={1} />
        <Controls />
        <MiniMap
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
          }}
          nodeColor={(node) => nodeColorMap[node.type] || '#8b5cf6'}
          maskColor="rgba(255, 255, 255, 0.8)"
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
