// BaseNode.js — Claude-inspired light mode design with solid headers
import { Handle, Position } from 'reactflow';
import { isValidElement, useRef, useEffect } from 'react';

/**
 * BaseNode renders any node from a declarative config object.
 * Uses Claude-inspired warm canvas design.
 *
 * Config shape:
 * {
 *   nodeType: string,           // display label in header
 *   headerColor: string,        // accent color for solid header
 *   icon: ReactComponent,       // Lucide icon component shown in header
 *   minWidth: number,           // minimum width in px (default 240)
 *   inputs: [{ id, label }],    // left-side target handles
 *   outputs: [{ id, label }],   // right-side source handles
 * }
 */
export const BaseNode = ({ id, data, config, children, style: extraStyle = {} }) => {
  const {
    nodeType = 'Node',
    headerColor = '#8b5cf6',
    icon: IconComponent,
    minWidth = 240,
    inputs = [],
    outputs = [],
  } = config;

  // Distribute handles evenly along the edge with better spacing
  const inputPositions = distributeHandles(inputs.length);
  const outputPositions = distributeHandles(outputs.length);

  return (
    <div style={{
      ...nodeStyle,
      minWidth,
      ...extraStyle
    }}>
      {/* Left-side target handles */}
      {inputs.map((handle, i) => (
        <div key={handle.id} style={handleContainerStyle}>
          <span style={{ ...inputHandleLabelStyle, top: `${inputPositions[i]}%` }}>
            {handle.label}
          </span>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            style={{
              top: `${inputPositions[i]}%`,
              ...handleStyle,
              background: headerColor,
              border: '2px solid var(--bg-primary)',
              ...(handle.style || {})
            }}
          />
        </div>
      ))}

      {/* Header - Solid color background */}
      <div style={{
        ...headerStyle,
        background: headerColor,
      }}>
        {IconComponent && (
          isValidElement(IconComponent) ? (
            IconComponent
          ) : (
            <IconComponent size={16} color="#ffffff" strokeWidth={2} style={{ flexShrink: 0 }} />
          )
        )}
        <span style={headerTextStyle}>{nodeType}</span>
      </div>

      {/* Body — white background with content */}
      <div style={bodyStyle}>
        {children}
      </div>

      {/* Right-side source handles */}
      {outputs.map((handle, i) => (
        <div key={handle.id} style={handleContainerStyle}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            style={{
              top: `${outputPositions[i]}%`,
              ...handleStyle,
              background: headerColor,
              border: '2px solid var(--bg-primary)',
              ...(handle.style || {})
            }}
          />
          <span style={{ ...outputHandleLabelStyle, top: `${outputPositions[i]}%` }}>
            {handle.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Shared field renderer ───────────────────────────────────────────────────
export const NodeField = ({ label, children }) => (
  <div style={fieldWrapStyle}>
    <label style={fieldLabelStyle}>{label}</label>
    {children}
  </div>
);

export const NodeInput = (props) => <input style={inputStyle} {...props} />;
export const NodeSelect = ({ children, ...props }) => (
  <select style={selectStyle} {...props}>{children}</select>
);
export const NodeTextarea = (props) => <textarea style={textareaStyle} {...props} />;

// ─── Auto-resizing Textarea ─────────────────────────────────────────────────
export const AutoResizeTextarea = ({ value, onChange, ...props }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, 40)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      style={autoResizeTextareaStyle}
      {...props}
    />
  );
};

// ─── Handle distribution helper ──────────────────────────────────────────────
function distributeHandles(count) {
  if (count === 0) return [];
  if (count === 1) return [50];
  // Better spacing: leave more room at edges
  const start = 20;
  const end = 80;
  const step = (end - start) / (count + 1);
  return Array.from({ length: count }, (_, i) => Math.round(start + step * (i + 1)));
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const nodeStyle = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-lg)',
  fontFamily: 'var(--font-body)',
  position: 'relative',
  overflow: 'visible',
  minWidth: 240,
  transition: 'box-shadow var(--transition-fast), transform var(--transition-fast)',
  boxShadow: 'var(--shadow-md)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
  position: 'relative',
};

const headerTextStyle = {
  fontSize: 16,
  fontFamily: 'var(--font-heading)',
  fontWeight: 400,
  letterSpacing: '0',
  color: '#ffffff',
};

const bodyStyle = {
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: 'var(--bg-primary)',
};

const handleContainerStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: 0,
  pointerEvents: 'none',
};

const handleStyle = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  cursor: 'crosshair',
  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
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

const outputHandleLabelStyle = {
  position: 'absolute',
  right: 22,
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
  textAlign: 'right',
};

export const handleLabelStyle = inputHandleLabelStyle;

export const fieldWrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

export const fieldLabelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-body)',
};

const sharedInputStyle = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: 13,
  padding: '8px 12px',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
};

export const inputStyle = { ...sharedInputStyle };
export const selectStyle = { ...sharedInputStyle, cursor: 'pointer' };
export const textareaStyle = {
  ...sharedInputStyle,
  resize: 'none',
  lineHeight: 1.5,
  minHeight: 40,
};

const autoResizeTextareaStyle = {
  ...sharedInputStyle,
  resize: 'none',
  lineHeight: 1.5,
  minHeight: 40,
  overflow: 'hidden',
};
