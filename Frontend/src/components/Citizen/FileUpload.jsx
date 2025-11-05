// FileUpload.jsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const FileUpload = ({ onFileSelect }) => {  // <-- accept callback
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));

    if (onFileSelect) {
      onFileSelect(acceptedFiles[0]); // send the first file to parent
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors duration-300 ${
        isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-400"
      }`}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon icon={faCloudUploadAlt} className="text-gray-400 text-5xl mb-3" />
      <p className="text-gray-600 mb-2 font-medium">
        {isDragActive ? "Drop the files here..." : "Drag & drop images here or click to browse"}
      </p>
      <button className="bg-gray-700 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition">
        Select Files
      </button>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="w-full h-24 overflow-hidden rounded-md">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
