// textNode.js — Part 3: dynamic resize + {{variable}} → Handle generation
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode, fieldLabelStyle, fieldWrapStyle } from './BaseNode';

const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
const HEADER_COLOR = '#06b6d4';

const baseConfig = {
  nodeType: 'Text',
  headerColor: HEADER_COLOR,
  icon: 'T',
  inputs: [],
  outputs: [{ id: 'output', label: 'output' }],
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);

  // Extract unique variable names from {{...}} syntax
  const variables = [...new Set([...currText.matchAll(VARIABLE_REGEX)].map(m => m[1]))];

  // Auto-resize textarea height to match content
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [currText]);

  // Dynamic node width based on longest line of text
  const longestLine = Math.max(...currText.split('\n').map(l => l.length), 10);
  const dynamicWidth = Math.min(Math.max(longestLine * 7.5 + 60, 220), 520);

  // Distribute variable handles across the node height.
  // ReactFlow positions Handle `top` % relative to the node root element.
  // We spread them from 30% (below header) to 85% (above output handle).
  const varHandlePositions = distributeVariableHandles(variables.length);

  return (
    <BaseNode
      id={id}
      data={data}
      config={{ ...baseConfig, minWidth: dynamicWidth }}
      style={{ minWidth: dynamicWidth, transition: 'min-width 0.15s ease' }}
    >
      {/* Variable Handles - left side, dynamic */}
      {variables.map((varName, i) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${varHandlePositions[i]}%`,
            width: 10,
            height: 10,
            background: HEADER_COLOR,
            border: '2px solid #0f1117',
            borderRadius: '50%',
          }}
          title={varName}
        />
      ))}

      {/* Text Content Field */}
      <div style={fieldWrapStyle}>
        <label style={fieldLabelStyle}>Content</label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder="Type text... use {{variable}} to create input handles"
          style={{
            background: '#1a2030',
            border: '1px solid #2a3448',
            borderRadius: 6,
            color: '#c9d1e0',
            fontSize: 12,
            padding: 'var(--space-5) var(--space-6)',
            width: '100%',
            boxSizing: 'border-box',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            resize: 'none',
            lineHeight: 1.6,
            minHeight: 48,
            overflow: 'hidden',
            transition: 'height 0.1s ease',
          }}
        />
      </div>

      {/* Variable Chips */}
      {variables.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
          {variables.map(v => (
            <span key={v} style={{
              background: '#06b6d41a',
              border: '1px solid #06b6d444',
              borderRadius: 4,
              color: HEADER_COLOR,
              fontSize: 10,
              padding: '2px 6px',
              fontFamily: 'inherit',
            }}>
              {'{{'}{v}{'}}'}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

function distributeVariableHandles(count) {
  if (count === 0) return [];
  if (count === 1) return [55];
  const start = 30;
  const end = 85;
  const step = (end - start) / (count + 1);
  return Array.from({ length: count }, (_, i) => Math.round(start + step * (i + 1)));
}
