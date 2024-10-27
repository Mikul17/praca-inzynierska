import { useFile } from "@/context/FileContext";


export default function FileName() {
    const { fileName } = useFile();

    return (
        <div
        className="flex justify-center items-center bg-secondary p-4 h-[48px] shadow-outer-shadow"
        style={{ borderRadius: "1rem 0 0 1rem", maxWidth: "30rem" }}
      >
        {fileName ? (
          <span className=" truncate ">File: {fileName}</span>
        ) : (
          <span >No file loaded</span>
        )}
      </div>
    )
}