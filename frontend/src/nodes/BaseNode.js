// BaseNode.js — Core abstraction for all pipeline nodes
import { Handle, Position } from 'reactflow';

/**
 * BaseNode renders any node from a declarative config object.
 *
 * Config shape:
 * {
 *   nodeType: string,           // display label in header
 *   headerColor: string,        // accent color for the left border + header
 *   icon: string,               // emoji or short string shown in header
 *   minWidth: number,           // minimum width in px (default 220)
 *   inputs: [                   // left-side target handles
 *     { id: string, label: string, style?: object }
 *   ],
 *   outputs: [                  // right-side source handles
 *     { id: string, label: string, style?: object }
 *   ],
 *   fields: [                   // rendered form fields
 *     {
 *       key: string,
 *       label: string,
 *       type: 'text' | 'select' | 'textarea',
 *       options?: [{ value, label }],   // for select
 *       defaultValue: any,
 *     }
 *   ],
 * }
 */
export const BaseNode = ({ id, data, config, children, style: extraStyle = {} }) => {
  const {
    nodeType = 'Node',
    headerColor = '#6366f1',
    icon = '⬡',
    minWidth = 220,
    inputs = [],
    outputs = [],
  } = config;

  // Distribute handles evenly along the edge
  const inputPositions = distributeHandles(inputs.length);
  const outputPositions = distributeHandles(outputs.length);

  return (
    <div style={{ ...nodeStyle, minWidth, borderColor: headerColor, borderLeftColor: headerColor, ...extraStyle }}>
      {/* Left-side target handles */}
      {inputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            style={{ top: `${inputPositions[i]}%`, ...handleStyle, background: headerColor, ...(handle.style || {}) }}
          />
          <span style={{ ...handleLabelStyle, left: 10, top: `calc(${inputPositions[i]}% - 8px)` }}>
            {handle.label}
          </span>
        </div>
      ))}

      {/* Header */}
      <div style={{ ...headerStyle, background: `linear-gradient(135deg, ${headerColor}22, ${headerColor}11)`, borderBottom: `1px solid ${headerColor}44` }}>
        <span style={iconStyle}>{icon}</span>
        <span style={headerTextStyle}>{nodeType}</span>
        <div style={{ ...headerAccentStyle, background: headerColor }} />
      </div>

      {/* Body — fields + optional children */}
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
            style={{ top: `${outputPositions[i]}%`, ...handleStyle, background: headerColor, ...(handle.style || {}) }}
          />
          <span style={{ ...handleLabelStyle, right: 10, top: `calc(${outputPositions[i]}% - 8px)`, textAlign: 'right' }}>
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
  background: '#0f1117',
  border: '1px solid #1e2535',
  borderLeft: '3px solid transparent',
  borderRadius: '10px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset',
  fontFamily: 'var(--font-body)',
  position: 'relative',
  overflow: 'visible',
  minWidth: 220,
  transition: 'box-shadow 0.2s ease',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-6)',
  padding: 'var(--space-6) var(--space-9)',
  borderRadius: '8px 8px 0 0',
  position: 'relative',
  overflow: 'hidden',
};

const iconStyle = {
  fontSize: 14,
  lineHeight: 1,
};

const headerTextStyle = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#c9d1e0',
};

const headerAccentStyle = {
  position: 'absolute',
  right: -20,
  top: -10,
  width: 60,
  height: 60,
  borderRadius: '50%',
  opacity: 0.12,
  filter: 'blur(16px)',
};

const bodyStyle = {
  padding: 'var(--space-8) var(--space-9) var(--space-9)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-6)',
};

const handleStyle = {
  width: 10,
  height: 10,
  border: '2px solid #0f1117',
  borderRadius: '50%',
  cursor: 'crosshair',
};

const handleLabelStyle = {
  position: 'absolute',
  fontSize: 9,
  color: '#64748b',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
};

export const fieldWrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
};

export const fieldLabelStyle = {
  fontSize: 10,
  fontWeight: 600,
  color: '#64748b',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
};

const sharedInputStyle = {
  background: '#1a2030',
  border: '1px solid #2a3448',
  borderRadius: 6,
  color: '#c9d1e0',
  fontSize: 12,
  padding: 'var(--space-5) var(--space-6)',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
};

export const inputStyle = { ...sharedInputStyle };
export const selectStyle = { ...sharedInputStyle, cursor: 'pointer' };
export const textareaStyle = {
  ...sharedInputStyle,
  resize: 'none',
  lineHeight: 1.5,
  minHeight: 60,
};
