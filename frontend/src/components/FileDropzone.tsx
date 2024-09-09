import React, { useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import Icon from "./Icon";
import toast from 'react-hot-toast';
import { useFile } from "@/hooks/FileContext";

export default function FileDropzone() {
  const { loadFile } = useFile();
  const [draggedFileType, setDraggedFileType] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      loadFile(file);
      toast.success('File uploaded successfully!');
    } else if (fileRejections.length > 0) {
      toast.error('Unsupported file format. Please use .csv or .txt');
    }
  }, [loadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    multiple: false,
    onDragEnter: (event) => {
      const items = event.dataTransfer.items;
      if (items.length > 0) {
        const item = items[0];
        if (item.type === 'text/csv' || item.type === 'text/plain') {
          setDraggedFileType('valid');
        } else {
          setDraggedFileType('invalid');
        }
      }
    },
    onDragLeave: () => {
      setDraggedFileType(null);
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center w-64 h-52 rounded-xl cursor-pointer transition-colors duration-200 ${
        isDragActive ? (draggedFileType === 'valid' ? 'bg-green-100' : 'bg-red-100') : 'hover:bg-gray-50'
      }`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23333' stroke-width='4' stroke-dasharray='16%2c 9' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <input {...getInputProps()} />
      <p className="text-xl text-center">
        {isDragActive
          ? draggedFileType === 'valid'
            ? "Drop the file here"
            : "Wrong file format!"
          : "Drop your file here (.csv or .txt)"}
      </p>
      <Icon name="file" size={46} color="currentColor" />
    </div>
  );
}