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
  loadSampleData: (tasks: Task[]) => void;
  generateSampleTasks: (size: number, maxR: number, maxP: number, maxQ: number) => void;
  downloadFile: (format: "csv" | "txt", orderOnly: boolean, order: number[]) => void;
  deleteLoadedFile: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const [fileTasks, setFileTasks] = useState<Task[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
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

  const generateSampleTasks = (size: number, maxR: number, maxP: number, maxQ: number) => {
    const tasks: Array<Task> = [];
    for( let i = 0; i<size; i++){
        tasks.push({
            id:i+1,
            r: Math.floor(Math.random() * (maxR - MIN_GENERATED_VALUE) + MIN_GENERATED_VALUE),
        p: Math.floor(Math.random() * (maxP - MIN_GENERATED_VALUE) + MIN_GENERATED_VALUE),
        q: Math.floor(Math.random() * (maxQ - MIN_GENERATED_VALUE) + MIN_GENERATED_VALUE),
      });
    }
    loadSampleData(tasks)
}

  const downloadFile = useCallback((format: "csv" | "txt", orderOnly: boolean, order: number[]) => {
    const file = convertTasksToFile(format, orderOnly, order);
    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Plik ${file.name} został pobrany`);
    } else {
      toast.error('Nie udało się wygenerować pliku');
    }
  }, []);

  const deleteLoadedFile = () => {
    if(!isFileLoaded){
      console.log("Error: file is not loaded");
      toast.error("File must be loaded to be deleted")
      return;
    }

    setIsFileLoaded(false);
    setFileName('');
    setFileTasks([]);
    sessionStorage.clear();
  }

  const value = {
    isFileLoaded,
    fileTasks,
    fileName,
    loadFile,
    loadSampleData,
    generateSampleTasks,
    downloadFile,
    deleteLoadedFile
  }


  return (
    <FileContext.Provider value={value}>
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