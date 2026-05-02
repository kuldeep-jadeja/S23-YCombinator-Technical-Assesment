// draggableNode.js — Claude-inspired draggable node palette items (light mode)
export const DraggableNode = ({ type, label, color = 'var(--accent-primary)', icon = '⬡' }) => {
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
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-canvas)',
        border: '1px solid var(--border-light)',
        borderLeft: `3px solid ${color}`,
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}`;
        e.currentTarget.style.borderLeftColor = `${color}`;
        e.currentTarget.style.background = 'var(--bg-secondary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-light)';
        e.currentTarget.style.borderLeftColor = `${color}`;
        e.currentTarget.style.background = 'var(--bg-canvas)';
      }}
    >
      <span style={{ fontSize: 14, color }}>{icon}</span>
      {label}
    </div>
  );
};
