// textNode.js — Text input node that auto-resizes and creates handles for {{variables}}
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode, fieldLabelStyle, fieldWrapStyle } from './BaseNode';

// Matches {{variable_name}} patterns in the text
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

const baseConfig = {
  nodeType: 'Text',
  headerColor: 'var(--node-text-header)',
  icon: Type,
  inputs: [],
  outputs: [{ id: 'output', label: 'Output' }],
};

// A textarea that grows as you type more content
const DynamicTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.max(ta.scrollHeight, 56)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={textareaStyle}
    />
  );
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  // Extract unique variable names from {{...}} syntax
  const variables = [...new Set([...currText.matchAll(VARIABLE_REGEX)].map(m => m[1]))];

  // Calculate width based on longest line to fit the content
  const maxLineLength = Math.max(...currText.split('\n').map(l => l.length), 10);
  const dynamicWidth = Math.min(Math.max(maxLineLength * 9 + 100, 200), 600);

  // Position variable handles along the left side
  const varHandlePositions = distributeVariableHandles(variables.length);

  return (
    <BaseNode
      id={id}
      data={data}
      config={{ ...baseConfig, minWidth: dynamicWidth }}
      style={{ minWidth: dynamicWidth }}
    >
      {/* Variable Handles — appear on the left for each {{variable}} in the text */}
      {variables.map((varName, i) => (
        <div key={varName} style={handleWrapperStyle}>
          <span style={{
            ...inputHandleLabelStyle,
            top: `${varHandlePositions[i]}%`,
          }}>
            {varName}
          </span>
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
              transform: 'translateY(-50%)',
            }}
            title={`Input: ${varName}`}
          />
        </div>
      ))}

      {/* Main text input field */}
      <div style={fieldWrapStyle}>
        <label style={fieldLabelStyle}>Content</label>
        <DynamicTextarea
          value={currText}
          onChange={setCurrText}
          placeholder="Type text... use {{variable}} to create input handles"
        />
      </div>

      {/* Show which variables are being used */}
      {variables.length > 0 && (
        <div style={chipsContainerStyle}>
          <span style={chipsLabelStyle}>Inputs:</span>
          {variables.map((v, i) => (
            <span key={v} style={{
              ...chipStyle,
              background: 'var(--node-text-bg)',
              border: '1px solid var(--node-text-header)',
              color: 'var(--node-text-header)',
            }}>
              {v}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

// Spread handles evenly from 15% to 90% of the node height
function distributeVariableHandles(count) {
  if (count === 0) return [];
  if (count === 1) return [50];
  const start = 15;
  const end = 90;
  const step = (end - start) / (count + 1);
  return Array.from({ length: count }, (_, i) => Math.round(start + step * (i + 1)));
}

// Shared styles
const handleWrapperStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: 0,
  pointerEvents: 'none',
};

const inputHandleLabelStyle = {
  position: 'absolute',
  left: 22,
  transform: 'translateY(-50%)',
  fontSize: 10,
  color: 'var(--text-secondary)',
  fontWeight: 500,
  letterSpacing: '0.01em',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  background: 'var(--bg-primary)',
  padding: '2px 6px',
  borderRadius: 4,
  boxShadow: 'var(--shadow-xs)',
  zIndex: 1,
};

const textareaStyle = {
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
};

const chipsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginTop: 4,
  alignItems: 'center',
};

const chipsLabelStyle = {
  fontSize: 10,
  color: 'var(--text-muted)',
  fontWeight: 500,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginRight: 4,
};

const chipStyle = {
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 4,
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
};
