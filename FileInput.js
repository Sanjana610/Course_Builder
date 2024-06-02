import React from 'react';
import './FileInputStyles.css'; // Assuming styles for FileInput are in this file

const FileInput = ({ onFileUpload }) => {
  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="file-input">
      <input
        type="file"
        id="file"
        onChange={handleChange}
      />
      <label htmlFor="file">Upload Resource</label>
    </div>
  );
};

export default FileInput;
