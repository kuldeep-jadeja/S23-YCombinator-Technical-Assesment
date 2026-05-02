// BaseNode.js — Claude-inspired light mode design with solid headers
import { Handle, Position } from 'reactflow';

/**
 * BaseNode renders any node from a declarative config object.
 * Uses Claude-inspired warm canvas design.
 *
 * Config shape:
 * {
 *   nodeType: string,           // display label in header
 *   headerColor: string,     // accent color for solid header
 *   icon: string,             // emoji or short string shown in header
 *   minWidth: number,         // minimum width in px (default 240)
 *   inputs: [{ id, label }],  // left-side target handles
 *   outputs: [{ id, label }],  // right-side source handles
 * }
 */
export const BaseNode = ({ id, data, config, children, style: extraStyle = {} }) => {
  const {
    nodeType = 'Node',
    headerColor = '#8b5cf6',
    icon = '⬡',
    minWidth = 240,
    inputs = [],
    outputs = [],
  } = config;

  // Distribute handles evenly along the edge
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
        <div key={handle.id}>
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
          <span style={{ ...handleLabelStyle, left: 14, top: `calc(${inputPositions[i]}% - 7px)` }}>
            {handle.label}
          </span>
        </div>
      ))}

      {/* Header - Solid color background */}
      <div style={{
        ...headerStyle,
        background: headerColor,
      }}>
        <span style={iconStyle}>{icon}</span>
        <span style={headerTextStyle}>{nodeType}</span>
      </div>

      {/* Body — white background with content */}
      <div style={bodyStyle}>
        {children}
      </div>

      {/* Right-side source handles */}
      {outputs.map((handle, i) => (
        <div key={handle.id}>
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
          <span style={{ ...handleLabelStyle, right: 14, top: `calc(${outputPositions[i]}% - 7px)`, textAlign: 'right' }}>
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

// ─── Handle distribution helper ──────────────────────────────────────────────
function distributeHandles(count) {
  if (count === 0) return [];
  if (count === 1) return [50];
  const step = 100 / (count + 1);
  return Array.from({ length: count }, (_, i) => Math.round(step * (i + 1)));
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

const iconStyle = {
  fontSize: 14,
  lineHeight: 1,
  color: '#ffffff',
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

const handleStyle = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  cursor: 'crosshair',
  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
};

const handleLabelStyle = {
  position: 'absolute',
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
};

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
  minHeight: 56,
};
