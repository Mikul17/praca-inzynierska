import { Task } from "./types";

export const ALLOWED_FILE_FORMATS : Array<string> = ["csv","txt"];


export const convertTasksToFile = (format: "csv" | "txt" = "csv", orderOnly: boolean): File | null => {
  const storedTasks = sessionStorage.getItem('fileTasks');
  const storedFileName = sessionStorage.getItem('fileName');

  if (!storedTasks || !storedFileName) {
    console.error('No tasks or filename found in sessionStorage');
    return null;
  }

  const tasks: Task[] = JSON.parse(storedTasks);
  let content: string;
  let mimeType: string;
  let fileName: string;

  if(orderOnly){
    content = tasks.map((task) => `${task.id}`).join(",");
  }else{
    content = tasks.map((task) => `${task.id},${task.r},${task.p},${task.q}`).join("\n");
  }


  if (format === "csv") {
    mimeType = "text/csv";
    fileName = storedFileName.endsWith('.csv') ? storedFileName : `${storedFileName}.csv`;
  } else {
    mimeType = "text/plain";
    fileName = storedFileName.endsWith('.txt') ? storedFileName : `${storedFileName}.txt`;
  }

  const blob = new Blob([content], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
};

export const extractTaskFromFile = (fileContent: string): Task[] => {
  const lines = fileContent.split("\n");
  let counter = 0;
  return lines
    .map((line) => {
      const [r, p, q] = line.split(",");
      return {
        id: counter++,
        r: parseInt(r),
        p: parseInt(p),
        q: parseInt(q),
      };
    })
    .filter((task) => !isNaN(task.r) && !isNaN(task.p) && !isNaN(task.q));
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
