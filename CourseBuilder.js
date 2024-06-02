import React, { useState } from 'react';
import './Styles.css';
import FileInput from './FileInput';

function CourseBuilder() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [newLink, setNewLink] = useState("");

  const addModule = () => {
    const newModule = {
      id: modules.length + 1,
      name: "New Module",
      resources: []
    };
    setModules([...modules, newModule]);
  };

  const deleteModule = (moduleId) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const renameModule = (moduleId, newName) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, name: newName } : module
    ));
  };

  const addResource = (moduleId, resource) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, resources: [...module.resources, resource] } : module
    ));
  };

  const deleteResource = (moduleId, resourceId) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, resources: module.resources.filter(resource => resource.id !== resourceId) } : module
    ));
  };

  const renameResource = (moduleId, resourceId, newName) => {
    setModules(modules.map(module => 
      module.id === moduleId ? {
        ...module, resources: module.resources.map(resource => 
          resource.id === resourceId ? { ...resource, name: newName } : resource
        ) 
      } : module
    ));
  };

  const handleDragStart = (event, moduleId, resourceId) => {
    event.dataTransfer.setData("moduleId", moduleId);
    event.dataTransfer.setData("resourceId", resourceId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, targetModuleId) => {
    const sourceModuleId = event.dataTransfer.getData("moduleId");
    const resourceId = event.dataTransfer.getData("resourceId");

    const updatedModules = modules.map(module => {
      if (module.id === targetModuleId) {
        return {
          ...module,
          resources: [...module.resources, ...modules.find(m => m.id === sourceModuleId).resources.filter(resource => resource.id === resourceId)]
        };
      } else if (module.id === sourceModuleId) {
        return {
          ...module,
          resources: module.resources.filter(resource => resource.id !== resourceId)
        };
      }
      return module;
    });

    setModules(updatedModules);
  };

  const handleFileUpload = (file) => {
    const resource = {
      id: Date.now(),
      type: 'file',
      name: file.name,
      file: file
    };
    if (selectedModule !== null) {
      addResource(selectedModule, resource);
    }
  };

  const handleLinkSubmit = (event) => {
    event.preventDefault();
    if (newLink && selectedModule !== null) {
      const resource = {
        id: Date.now(),
        type: 'link',
        name: newLink,
        url: newLink
      };
      addResource(selectedModule, resource);
      setNewLink("");
    }
  };

  return (
    <div className="container">
      <h1>Course Builder</h1>
      <button onClick={addModule}>Add Module</button>
      {modules.map(module => (
        <div key={module.id} className="module">
          <h2>{module.name}</h2>
          <button onClick={() => deleteModule(module.id)}>Delete Module</button>
          <input
            type="text"
            value={module.name}
            onChange={(e) => renameModule(module.id, e.target.value)}
          />
          <div
            className="resources"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, module.id)}
          >
            {module.resources.map(resource => (
              <div
                key={resource.id}
                className="resource"
                draggable
                onDragStart={(e) => handleDragStart(e, module.id, resource.id)}
              >
                {resource.type === 'file' ? (
                  <p>{resource.name}</p>
                ) : (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.name}</a>
                )}
                <input
                  type="text"
                  value={resource.name}
                  onChange={(e) => renameResource(module.id, resource.id, e.target.value)}
                />
                <button onClick={() => deleteResource(module.id, resource.id)}>Delete Resource</button>
              </div>
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
      ))}
    </div>
  );
}

export default CourseBuilder;
