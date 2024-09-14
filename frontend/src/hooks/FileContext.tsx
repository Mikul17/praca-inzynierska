"use client";
import { readFileAsText,convertTasksToFile, extractTaskFromFile } from "@/common/FileUtils";
import { Task } from "@/common/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FileContextType {
  isFileLoaded: boolean;
  fileTasks: Task[] | null;
  fileName: string | null;
  loadFile: (file: File) => Promise<void>;
  sendFileToBackend: () => Promise<void>;
  loadSampleData: (tasks: Task[]) => void;
  isUploading: boolean;
  generateSampleTasks: (size: number) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const [fileTasks, setFileTasks] = useState<Task[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const MAX_GENERATED_VALUE = 9999;
  const MIN_GENERATED_VALUE = 1;



  const saveToSessionStorage = useCallback((tasks: Task[] | null, name: string | null, loaded: boolean) => {
    sessionStorage.setItem('isFileLoaded', JSON.stringify(loaded));
    sessionStorage.setItem('fileTasks', JSON.stringify(tasks));
    sessionStorage.setItem('fileName', name || '');
  }, []);

  useEffect(() => {
    const storedIsFileLoaded = sessionStorage.getItem('isFileLoaded');
    const storedFileTasks = sessionStorage.getItem('fileTasks');
    const storedFileName = sessionStorage.getItem('fileName');

    if (storedIsFileLoaded && storedFileTasks && storedFileName) {
      setIsFileLoaded(JSON.parse(storedIsFileLoaded));
      setFileTasks(JSON.parse(storedFileTasks));
      setFileName(storedFileName);
    }
  }, []);

  useEffect(() => {
    saveToSessionStorage(fileTasks, fileName, isFileLoaded);
  }, [isFileLoaded, fileTasks, fileName]);

  const loadFile = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      const tasks = extractTaskFromFile(content);
      
      setFileTasks(tasks);
      setFileName(file.name);
      setIsFileLoaded(true);
      saveToSessionStorage(tasks, file.name, true);
    } catch (error) {
      console.error('Error loading file:', error);
      toast.success('Error loading file');
    }
  }, [saveToSessionStorage]);

  const loadSampleData = useCallback((tasks: Task[]) => {
    try{
      setFileTasks(tasks);
      setFileName("Sample data");
      setIsFileLoaded(true);
      saveToSessionStorage(tasks, "Sample data", true);
      toast.success('Data generated successfully')
    } catch (error) {
      console.log('Error while generating sample data:', error)
      toast.error('Error while generating sample data')
    }
    
  }, [saveToSessionStorage]);

  const generateSampleTasks = (size: number) => {
    const tasks: Array<Task> = [];
    for( let i = 0; i<size; i++){
        tasks.push({
            id:i,
            r: Math.floor(Math.random() * (MAX_GENERATED_VALUE - MIN_GENERATED_VALUE) + MIN_GENERATED_VALUE),
        p: Math.floor(Math.random() * (MAX_GENERATED_VALUE - MIN_GENERATED_VALUE) + MIN_GENERATED_VALUE),
        q: Math.floor(Math.random() * (MAX_GENERATED_VALUE - MIN_GENERATED_VALUE) + MIN_GENERATED_VALUE),
      });
    }
    loadSampleData(tasks)
}

  const sendFileToBackend = useCallback(async () => {
    if (!isFileLoaded || !fileTasks) {
      throw new Error('No file loaded');
    }

    setIsUploading(true);

    try {
      const csvContent = convertTasksToFile(fileTasks);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, data: csvContent }),
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
  }, [isFileLoaded, fileTasks, fileName]);



  return (
    <FileContext.Provider value={{ isFileLoaded, fileTasks, fileName, loadFile, sendFileToBackend, isUploading, loadSampleData, generateSampleTasks }}>
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