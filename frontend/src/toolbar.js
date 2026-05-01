// toolbar.js
import { DraggableNode } from './draggableNode';

const NODES = [
  // Original 4
  { type: 'customInput',   label: 'Input',          color: '#10b981', icon: '→' },
  { type: 'llm',           label: 'LLM',            color: '#8b5cf6', icon: '✦' },
  { type: 'customOutput',  label: 'Output',         color: '#f59e0b', icon: '←' },
  { type: 'text',          label: 'Text',           color: '#06b6d4', icon: 'T' },
  // 5 new nodes
  { type: 'apiRequest',    label: 'API Request',    color: '#f43f5e', icon: '⇄' },
  { type: 'conditional',   label: 'Condition',      color: '#ec4899', icon: '⟁' },
  { type: 'transform',     label: 'Transform',      color: '#14b8a6', icon: '⟳' },
  { type: 'note',          label: 'Note',           color: '#eab308', icon: '✎' },
  { type: 'vectorSearch',  label: 'Vector Search',  color: '#a855f7', icon: '◈' },
];

export const PipelineToolbar = () => {
  return (
    <div style={toolbarStyle}>
      <div style={brandStyle}>
        <span style={logoStyle}>VS</span>
        <span style={brandNameStyle}>Pipeline Studio</span>
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
  gap: 'var(--space-9)',
  padding: '0 var(--space-10)',
  height: 'var(--space-15)',
  background: '#080c12',
  borderBottom: '1px solid #1e2535',
  boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  overflowX: 'auto',
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-6)',
  flexShrink: 0,
};

const logoStyle = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: 13,
  padding: 'var(--space-4) var(--space-7)',
  borderRadius: 6,
  letterSpacing: '0.02em',
};

const brandNameStyle = {
  fontFamily: 'var(--font-heading)',
  fontSize: 13,
  fontWeight: 600,
  color: '#c9d1e0',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

const dividerStyle = {
  width: 1,
  height: 'var(--space-13)',
  background: '#1e2535',
  flexShrink: 0,
};

const nodesWrapStyle = {
  display: 'flex',
  gap: 'var(--space-6)',
  alignItems: 'center',
  flexWrap: 'nowrap',
};
