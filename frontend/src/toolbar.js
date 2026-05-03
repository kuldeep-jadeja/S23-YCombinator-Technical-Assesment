// toolbar.js — Top navigation bar with node palette
// Contains the search box and draggable node cards organized by category
import { useState } from 'react';
import { Search, ArrowRight, Sparkles, ArrowLeft, Type, ArrowLeftRight, GitBranch, RefreshCw, StickyNote, Database, ChevronDown, GripVertical } from 'lucide-react';
import { DraggableNode } from './draggableNode';

// Node definitions grouped by category
const NODE_GROUPS = [
  {
    label: 'Start',
    nodes: [
      { type: 'customInput', label: 'Input', color: 'var(--node-input)', icon: ArrowRight, headerColor: 'var(--node-input-header)' },
      { type: 'customOutput', label: 'Output', color: 'var(--node-output)', icon: ArrowLeft, headerColor: 'var(--node-output-header)' },
    ],
  },
  {
    label: 'AI',
    nodes: [
      { type: 'llm', label: 'LLM', color: 'var(--node-llm)', icon: Sparkles, headerColor: 'var(--node-llm-header)' },
      { type: 'text', label: 'Text', color: 'var(--node-text)', icon: Type, headerColor: 'var(--node-text-header)' },
    ],
  },
  {
    label: 'Logic',
    nodes: [
      { type: 'conditional', label: 'Condition', color: 'var(--node-conditional)', icon: GitBranch, headerColor: 'var(--node-conditional-header)' },
      { type: 'transform', label: 'Transform', color: 'var(--node-transform)', icon: RefreshCw, headerColor: 'var(--node-transform-header)' },
    ],
  },
  {
    label: 'Data',
    nodes: [
      { type: 'apiRequest', label: 'API', color: 'var(--node-api)', icon: ArrowLeftRight, headerColor: 'var(--node-api-header)' },
    ],
  },
  {
    label: 'Integrations',
    nodes: [
      { type: 'vectorSearch', label: 'Vector Search', color: 'var(--node-vector)', icon: Database, headerColor: 'var(--node-vector-header)' },
    ],
  },
  {
    label: 'Chat',
    nodes: [
      { type: 'note', label: 'Note', color: 'var(--node-note)', icon: StickyNote, headerColor: 'var(--node-note-header)' },
    ],
  },
];

const CATEGORIES = ['Start', 'VectorShift', 'Knowledge', 'AI', 'Integrations', 'Logic', 'Data', 'Chat'];

export const PipelineToolbar = () => {
  const [activeCategory, setActiveCategory] = useState('Start');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter nodes based on search query
  const filteredGroups = NODE_GROUPS.map(group => ({
    ...group,
    nodes: group.nodes.filter(node =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.nodes.length > 0);

  return (
    <div className="toolbar">
      {/* Search box and node palette */}
      <div className="toolbar-row palette-row">
        {/* Search input */}
        <div className="toolbar-search">
          <Search size={14} color="var(--muted)" />
          <input
            type="text"
            placeholder="Search Nodes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ChevronDown size={12} color="var(--muted)" />
        </div>

        {/* Scrollable list of node groups */}
        <div className="palette-scroll">
          {filteredGroups.map(group => (
            <div key={group.label} className="palette-group">
              <span className="palette-group-label">{group.label}</span>
              <div className="palette-group-nodes">
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
    </div>
  );
};