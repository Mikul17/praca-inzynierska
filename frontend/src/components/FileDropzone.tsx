import { useDropzone } from "react-dropzone";

export default function FileDropzone() {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  );
}
