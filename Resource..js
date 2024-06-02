import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const Resource = ({ moduleId, resource, index, deleteResource, renameResource, moveResource }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.RESOURCE,
    item: { moduleId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.RESOURCE,
    hover: (draggedItem) => {
      if (draggedItem.moduleId === moduleId && draggedItem.index !== index) {
        moveResource(moduleId, draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="resource" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {resource.type === 'file' ? (
        <p>{resource.name}</p>
      ) : (
        <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.name}</a>
      )}
      <input
        type="text"
        value={resource.name}
        onChange={(e) => renameResource(moduleId, resource.id, e.target.value)}
      />
      <button onClick={() => deleteResource(moduleId, resource.id)}>Delete Resource</button>
    </div>
  );
};

export default Resource;
