// textNode.js — Dynamic resize + {{variable}} → Handle generation (light mode)
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode, fieldLabelStyle, fieldWrapStyle, handleLabelStyle } from './BaseNode';

const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

const baseConfig = {
  nodeType: 'Text',
  headerColor: 'var(--node-text-header)',
  icon: Type,
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
  const dynamicWidth = Math.min(Math.max(longestLine * 8 + 80, 240), 560);

  // Distribute variable handles across the node height
  const varHandlePositions = distributeVariableHandles(variables.length);

  return (
    <BaseNode
      id={id}
      data={data}
      config={{ ...baseConfig, minWidth: dynamicWidth }}
      style={{ minWidth: dynamicWidth }}
    >
      {/* Variable Handles - left side, dynamic */}
      {variables.map((varName, i) => (
        <div key={varName}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{
              top: `${varHandlePositions[i]}%`,
              width: 10,
              height: 10,
              background: 'var(--node-text-header)',
              border: '2px solid var(--bg-primary)',
              borderRadius: '50%',
            }}
            title={varName}
          />
          <span style={{ ...handleLabelStyle, left: 14, top: `calc(${varHandlePositions[i]}% - 7px)` }}>
            {varName}
          </span>
        </div>
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
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: 13,
            padding: '10px 12px',
            width: '100%',
            boxSizing: 'border-box',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            resize: 'none',
            lineHeight: 1.6,
            minHeight: 56,
            overflow: 'hidden',
          }}
        />
      </div>

      {/* Variable Chips */}
      {variables.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {variables.map(v => (
            <span key={v} style={{
              background: 'var(--node-text-bg)',
              border: '1px solid var(--node-text)',
              borderRadius: 4,
              color: 'var(--node-text)',
              fontSize: 11,
              padding: '3px 8px',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
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
