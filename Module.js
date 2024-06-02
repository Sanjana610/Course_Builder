import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Resource from './Resource.';
import FileInput from './FileInput';

const Module = ({
  index,
  module,
  deleteModule,
  renameModule,
  moveModule,
  addResource,
  deleteResource,
  renameResource,
  moveResource,
  handleFileUpload,
  handleLinkSubmit,
  newLink,
  setNewLink,
  selectedModule,
  setSelectedModule,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.MODULE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.MODULE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveModule(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="module" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <h2>{module.name}</h2>
      <button onClick={() => deleteModule(module.id)}>Delete Module</button>
      <input
        type="text"
        value={module.name}
        onChange={(e) => renameModule(module.id, e.target.value)}
      />
      <div className="resources">
        {module.resources.map((resource, index) => (
          <Resource
            key={resource.id}
            moduleId={module.id}
            resource={resource}
            index={index}
            deleteResource={deleteResource}
            renameResource={renameResource}
            moveResource={moveResource}
          />
        ))}
      </div>
      <FileInput onFileUpload={handleFileUpload} />
      <form onSubmit={handleLinkSubmit} className="link-form">
        <input
          type="text"
          placeholder="Add link as resource"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <button type="submit">Add Link</button>
      </form>
    </div>
  );
};

export default Module;
