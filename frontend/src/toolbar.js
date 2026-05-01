// toolbar.js — VectorShift-inspired pipeline toolbar (light mode)
import { DraggableNode } from './draggableNode';

const NODES = [
  { type: 'customInput',   label: 'Input',         color: '#10b981', icon: '→' },
  { type: 'llm',          label: 'LLM',           color: '#8b5cf6', icon: '✦' },
  { type: 'customOutput', label: 'Output',        color: '#f59e0b', icon: '←' },
  { type: 'text',         label: 'Text',          color: '#0ea5e9', icon: 'T' },
  { type: 'apiRequest',   label: 'API Request',   color: '#f43f5e', icon: '⇄' },
  { type: 'conditional',  label: 'Condition',     color: '#ec4899', icon: '⟁' },
  { type: 'transform',    label: 'Transform',     color: '#14b8a6', icon: '⟳' },
  { type: 'note',         label: 'Note',          color: '#eab308', icon: '✎' },
  { type: 'vectorSearch', label: 'Vector Search', color: '#a855f7', icon: '◈' },
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
  gap: 16,
  padding: '0 20px',
  height: 56,
  background: 'var(--bg-primary)',
  borderBottom: '1px solid var(--border-light)',
  position: 'relative',
  zIndex: 100,
  overflowX: 'auto',
  boxShadow: 'var(--shadow-xs)',
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexShrink: 0,
};

const logoStyle = {
  background: 'var(--accent-primary)',
  color: '#ffffff',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: 12,
  padding: '5px 10px',
  borderRadius: 'var(--radius-sm)',
  letterSpacing: '0.02em',
};

const brandNameStyle = {
  fontFamily: 'var(--font-heading)',
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--text-primary)',
  letterSpacing: '-0.01em',
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
