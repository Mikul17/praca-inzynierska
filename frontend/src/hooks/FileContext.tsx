"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface FileContextType {
  isFileLoaded: boolean;
  fileData: string[][] | null;
  fileName: string | null;
  loadFile: (file: File) => Promise<void>;
  sendFileToBackend: () => Promise<void>;
  isUploading: boolean;
}

  const FileContext = createContext<FileContextType | undefined>(undefined);



export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const [fileData, setFileData] = useState<string[][] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedIsFileLoaded = sessionStorage.getItem('isFileLoaded');
    const storedFileData = sessionStorage.getItem('fileData');
    const storedFileName = sessionStorage.getItem('fileName');

    if (storedIsFileLoaded && storedFileData && storedFileName) {
      setIsFileLoaded(JSON.parse(storedIsFileLoaded));
      setFileData(JSON.parse(storedFileData));
      setFileName(storedFileName);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('isFileLoaded', JSON.stringify(isFileLoaded));
    sessionStorage.setItem('fileData', JSON.stringify(fileData));
    sessionStorage.setItem('fileName', fileName || '');
  }, [isFileLoaded, fileData, fileName]);


  const loadFile = useCallback(async (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n');
      const data = lines.map(line => line.split(','));
      
      setFileData(data);
      setFileName(file.name);
      setIsFileLoaded(true);
    };

    reader.readAsText(file);
  }, []);

  const sendFileToBackend = useCallback(async () => {
    if (!isFileLoaded || !fileData) {
      throw new Error('No file loaded');
    }

    setIsUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, data: fileData }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  }, [isFileLoaded, fileData, fileName]);

  return (
    <FileContext.Provider value={{ isFileLoaded, fileData, fileName, loadFile, sendFileToBackend, isUploading }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};
