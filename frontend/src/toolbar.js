// toolbar.js — Modern pipeline toolbar with grouped node palette
import { ArrowRight, Sparkles, ArrowLeft, Type, ArrowLeftRight, GitBranch, RefreshCw, StickyNote, Database, Hexagon, Plus } from 'lucide-react';
import { DraggableNode } from './draggableNode';

const NODE_GROUPS = [
  {
    label: 'IO',
    nodes: [
      { type: 'customInput', label: 'Input', color: 'var(--node-input)', icon: ArrowRight, headerColor: 'var(--node-input-header)' },
      { type: 'customOutput', label: 'Output', color: 'var(--node-output)', icon: ArrowLeft, headerColor: 'var(--node-output-header)' },
    ],
  },
  {
    label: 'PROCESSING',
    nodes: [
      { type: 'llm', label: 'LLM', color: 'var(--node-llm)', icon: Sparkles, headerColor: 'var(--node-llm-header)' },
      { type: 'text', label: 'Text', color: 'var(--node-text)', icon: Type, headerColor: 'var(--node-text-header)' },
      { type: 'apiRequest', label: 'API', color: 'var(--node-api)', icon: ArrowLeftRight, headerColor: 'var(--node-api-header)' },
    ],
  },
  {
    label: 'LOGIC',
    nodes: [
      { type: 'conditional', label: 'Condition', color: 'var(--node-conditional)', icon: GitBranch, headerColor: 'var(--node-conditional-header)' },
      { type: 'transform', label: 'Transform', color: 'var(--node-transform)', icon: RefreshCw, headerColor: 'var(--node-transform-header)' },
    ],
  },
  {
    label: 'UTILITY',
    nodes: [
      { type: 'note', label: 'Note', color: 'var(--node-note)', icon: StickyNote, headerColor: 'var(--node-note-header)' },
      { type: 'vectorSearch', label: 'Vector', color: 'var(--node-vector)', icon: Database, headerColor: 'var(--node-vector-header)' },
    ],
  },
];

export const PipelineToolbar = () => {
  return (
    <div style={toolbarStyle}>
      {/* Brand */}
      <div style={brandContainer}>
        <div style={brandLogo}>
          <Hexagon size={28} color="var(--accent-primary)" strokeWidth={1.5} />
          <Plus size={12} color="var(--bg-canvas)" strokeWidth={3} style={{ position: 'absolute' }} />
        </div>
        <div style={brandText}>
          <span style={brandNameStyle}>Canvas</span>
          <span style={brandTagStyle}>v1.0</span>
        </div>
      </div>

      {/* Divider */}
      <div style={dividerStyle} />

      {/* Node Groups */}
      <div style={groupsContainer}>
        {NODE_GROUPS.map((group, groupIndex) => (
          <div key={group.label} style={groupStyle}>
            <span style={groupLabelStyle}>{group.label}</span>
            <div style={groupNodesStyle}>
              {group.nodes.map(n => (
                <DraggableNode
                  key={n.type}
                  type={n.type}
                  label={n.label}
                  color={n.color}
                  icon={n.icon}
                  headerColor={n.headerColor}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  padding: '0 24px',
  height: 72,
  background: 'var(--bg-primary)',
  borderBottom: '1px solid var(--border-light)',
  position: 'relative',
  zIndex: 100,
  overflowX: 'auto',
};

const brandContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexShrink: 0,
};

const brandLogo = {
  position: 'relative',
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const brandText = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const brandNameStyle = {
  fontFamily: 'var(--font-heading)',
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--text-primary)',
  letterSpacing: '-0.01em',
  lineHeight: 1,
};

const brandTagStyle = {
  fontSize: 10,
  fontWeight: 500,
  color: 'var(--text-muted)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const dividerStyle = {
  width: 1,
  height: 32,
  background: 'var(--border-light)',
  flexShrink: 0,
};

const groupsContainer = {
  display: 'flex',
  gap: 24,
  alignItems: 'center',
};

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const groupLabelStyle = {
  fontSize: 9,
  fontWeight: 600,
  color: 'var(--text-muted)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  paddingLeft: 4,
};

const groupNodesStyle = {
  display: 'flex',
  gap: 6,
  alignItems: 'center',
};
