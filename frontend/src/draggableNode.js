// draggableNode.js — VectorShift-style square palette cards
import { isValidElement } from 'react';

const Icon = ({ icon, color }) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const IconComponent = icon;
  return <IconComponent size={18} color={color} strokeWidth={2} />;
};

export const DraggableNode = ({ type, label, color = 'var(--accent-primary)', icon, headerColor }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`palette-card ${type}`}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className="card-icon">
        <Icon icon={icon} color={headerColor || color} />
      </div>
      <span className="card-label">{label}</span>
    </div>
  );
};
