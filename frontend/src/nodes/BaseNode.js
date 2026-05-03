// BaseNode.js — VectorShift-style node card with pale blue headers
import { Handle, Position } from 'reactflow';
import { isValidElement, useRef, useEffect } from 'react';
import { Maximize2, Settings, X } from 'lucide-react';

/**
 * BaseNode renders any node from a declarative config object.
 * Uses VectorShift-inspired light mode design with pale blue headers.
 *
 * Config shape:
 * {
 *   nodeType: string,           // display label in header
 *   headerColor: string,        // accent color for solid header
 *   icon: ReactComponent,       // Lucide icon component shown in header
 *   minWidth: number,           // minimum width in px (default 240)
 *   inputs: [{ id, label }],    // left-side target handles
 *   outputs: [{ id, label }],   // right-side source handles
 *   description: string,        // optional description text
 *   showIdBar: boolean,         // show internal id bar (default true)
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
    description,
    showIdBar = true,
    internalName,
  } = config;

  // Distribute handles evenly along the edge
  const inputPositions = distributeHandles(inputs.length);
  const outputPositions = distributeHandles(outputs.length);

  // Derive short id for display (e.g., "input_0" from "customInput-1")
  const displayId = internalName || id.replace('customInput-', 'input_').replace('customOutput-', 'output_').replace('llm-', 'llm_').replace('text-', 'text_');

  return (
    <div className="node-card" style={{ minWidth, ...extraStyle }}>
      {/* Left-side target handles */}
      {inputs.map((handle, i) => (
        <div key={handle.id} style={handleContainerStyle}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            className="vs-handle"
            style={{
              top: `${inputPositions[i]}%`,
              ...handleStyle,
              background: 'var(--bg-primary)',
              border: '2px solid var(--blue)',
              ...(handle.style || {})
            }}
          />
        </div>
      ))}

      {/* Header - Pale blue background with colored icon */}
      <div className="node-header">
        <div className="node-icon" style={{ background: headerColor }}>
          {IconComponent && (
            isValidElement(IconComponent) ? (
              IconComponent
            ) : (
              <IconComponent size={14} color="#ffffff" strokeWidth={2} />
            )
          )}
        </div>
        <span className="node-title">{nodeType}</span>
      </div>

      {/* Internal ID bar */}
      {showIdBar && (
        <div style={idBarContainerStyle}>
          <span className="node-id-bar">{displayId}</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <div style={descriptionStyle}>{description}</div>
      )}

      {/* Body */}
      <div className="node-body">
        {children}
      </div>

      {/* Right-side source handles */}
      {outputs.map((handle, i) => (
        <div key={handle.id} style={handleContainerStyle}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            className="vs-handle"
            style={{
              top: `${outputPositions[i]}%`,
              ...handleStyle,
              background: 'var(--bg-primary)',
              border: '2px solid var(--blue)',
              ...(handle.style || {})
            }}
          />
        </div>
      ))}
    </div>
  );
};

// ─── Shared field renderer ───────────────────────────────────────────────────
export const NodeField = ({ label, children, badge }) => (
  <div className="node-field">
    <label className="field-label">
      {label}
      {badge && <span className="field-badge">{badge}</span>}
    </label>
    {children}
  </div>
);

export const NodeInput = (props) => <input {...props} />;
export const NodeSelect = ({ children, ...props }) => (
  <select {...props}>{children}</select>
);
export const NodeTextarea = (props) => <textarea {...props} />;

// ─── Variable pill for showing linked variables ─────────────────────────────
export const VariablePill = ({ text }) => (
  <span className="variable-pill">{text}</span>
);

// ─── Suggestion box ─────────────────────────────────────────────────────────
export const SuggestionBox = ({ children }) => (
  <div className="suggestion-box">{children}</div>
);

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
      style={{ width: '100%', resize: 'none', minHeight: 40 }}
      {...props}
    />
  );
};

// ─── Handle distribution helper ──────────────────────────────────────────────
function distributeHandles(count) {
  if (count === 0) return [];
  if (count === 1) return [50];
  const start = 20;
  const end = 80;
  const step = (end - start) / (count + 1);
  return Array.from({ length: count }, (_, i) => Math.round(start + step * (i + 1)));
}

// ─── Styles ──────────────────────────────────────────────────────────────────
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

const idBarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '5px 14px',
  background: '#eef1ff',
  borderBottom: '1px solid #d8dbf3',
};

const descriptionStyle = {
  padding: '10px 14px',
  fontSize: 12,
  color: 'var(--muted)',
  borderBottom: '1px solid var(--border-light)',
  lineHeight: 1.5,
};

// Export shared styles for use in custom nodes
export const fieldWrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

export const fieldLabelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  letterSpacing: '0.5px',
  fontFamily: 'var(--font-body)',
};