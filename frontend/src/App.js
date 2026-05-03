// App.js — Main app component
// Renders the toolbar, canvas, and submit button
import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-canvas)' }}>
      <PipelineToolbar />
      <PipelineUI nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
      <SubmitButton nodes={nodes} edges={edges} />
    </div>
  );
}

export default App;