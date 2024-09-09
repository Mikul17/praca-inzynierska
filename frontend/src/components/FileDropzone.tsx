import { useDropzone } from "react-dropzone";
import Icon from "./Icon";

export default function FileDropzone() {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div
      {...getRootProps()}
      className="flex flex-col justify-center items-center w-64 h-52 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='4' stroke-dasharray='16%2c 9' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <input {...getInputProps()} />
      <p className="text-xl text-center">Drop your file here (.csv or .txt)</p>
      <Icon name="file" size={46} color="currentColor" />
    </div>
  );
}
