// draggableNode.js — Draggable node cards shown in the toolbar palette
// These are the tiles users drag onto the canvas to create nodes
import { isValidElement } from 'react';

// Renders an icon from either a React element or a Lucide icon component
const Icon = ({ icon, color }) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const IconComponent = icon;
  return <IconComponent size={18} color={color} strokeWidth={2} />;
};

// A palette card that can be dragged onto the canvas
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