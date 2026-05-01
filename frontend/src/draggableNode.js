// draggableNode.js
export const DraggableNode = ({ type, label, color = '#6366f1', icon = '⬡' }) => {
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
        padding: 'var(--space-5) var(--space-8)',
        borderRadius: 7,
        background: '#0f1117',
        border: `1px solid ${color}44`,
        borderLeft: `2px solid ${color}`,
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 600,
        color: '#c9d1e0',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s, border-color 0.15s',
        userSelect: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
      onMouseLeave={e => e.currentTarget.style.background = '#0f1117'}
    >
      <span style={{ fontSize: 13, color }}>{icon}</span>
      {label}
    </div>
  );
};
