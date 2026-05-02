// toolbar.js — VectorShift-inspired pipeline toolbar (light mode)
import { DraggableNode } from './draggableNode';

const NODES = [
  { type: 'customInput', label: 'Input', color: 'var(--node-input)', icon: '→' },
  { type: 'llm', label: 'LLM', color: 'var(--node-llm)', icon: '✦' },
  { type: 'customOutput', label: 'Output', color: 'var(--node-output)', icon: '←' },
  { type: 'text', label: 'Text', color: 'var(--node-text)', icon: 'T' },
  { type: 'apiRequest', label: 'API Request', color: 'var(--node-api)', icon: '⇄' },
  { type: 'conditional', label: 'Condition', color: 'var(--node-conditional)', icon: '⟁' },
  { type: 'transform', label: 'Transform', color: 'var(--node-transform)', icon: '⟳' },
  { type: 'note', label: 'Note', color: 'var(--node-note)', icon: '✎' },
  { type: 'vectorSearch', label: 'Vector Search', color: 'var(--node-vector)', icon: '◈' },
];

export const PipelineToolbar = () => {
  return (
    <div style={toolbarStyle}>
      <div style={brandStyle}>
        <span style={logoStyle}>❈</span>
        <span style={brandNameStyle}>Canvas</span>
      </div>
      <div style={dividerStyle} />
      <div style={nodesWrapStyle}>
        {NODES.map(n => (
          <DraggableNode key={n.type} type={n.type} label={n.label} color={n.color} icon={n.icon} />
        ))}
      </div>
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '0 20px',
  height: 64,
  background: 'var(--bg-canvas)',
  borderBottom: '1px solid var(--border-light)',
  position: 'relative',
  zIndex: 100,
  overflowX: 'auto',
  boxShadow: 'none',
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexShrink: 0,
};

const logoStyle = {
  background: 'transparent',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-heading)',
  fontWeight: 400,
  fontSize: 24,
  padding: '0',
  borderRadius: '0',
  lineHeight: 1,
};

const brandNameStyle = {
  fontFamily: 'var(--font-heading)',
  fontSize: 22,
  fontWeight: 400,
  color: 'var(--text-primary)',
  letterSpacing: '0',
  whiteSpace: 'nowrap',
};

const dividerStyle = {
  width: 1,
  height: 24,
  background: 'var(--border-light)',
  flexShrink: 0,
};

const nodesWrapStyle = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'nowrap',
};
