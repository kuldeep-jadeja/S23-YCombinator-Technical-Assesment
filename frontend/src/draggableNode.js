// draggableNode.js — Modern compact draggable node palette items
import { isValidElement } from 'react';

const Icon = ({ icon, color }) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const IconComponent = icon;
  return <IconComponent size={13} color={color} strokeWidth={2} />;
};

export const DraggableNode = ({ type, label, color = 'var(--accent-primary)', icon, headerColor }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      style={nodeStyle}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = 'var(--bg-secondary)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-light)';
        e.currentTarget.style.background = 'var(--bg-primary)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {headerColor && (
        <span style={{ ...colorBadge, background: headerColor }} />
      )}
      <Icon icon={icon} color={color} />
      <span style={labelStyle}>{label}</span>
    </div>
  );
};

const nodeStyle = {
  cursor: 'grab',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  borderRadius: 'var(--radius-md)',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-light)',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
  transition: 'all var(--transition-fast)',
  userSelect: 'none',
  flexShrink: 0,
};

const colorBadge = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  flexShrink: 0,
};

const labelStyle = {
  lineHeight: 1,
};
