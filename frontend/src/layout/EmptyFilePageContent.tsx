import FileDropzone from "@/components/content/FileDropzone";
import TooltipContent from "@/components/content/TooltipInformation";
import Icon from "@/components/Icon";
import { Tooltip, Button } from "@nextui-org/react";
import Gap from "./Gap";
import { useFile } from "@/context/FileContext";

interface LayoutProps {
    height: number | string;
}

export default function EmptyFilePageContent({height}: LayoutProps) {
    const { generateSampleTasks } = useFile();

    const handleGenerateSampleData = () => {
        generateSampleTasks(15);
      }
    

  return (
    <div
      className="flex justify-center items-center flex-col"
      style={{ height }}
    >
      <div
        className="flex flex-col shadow-outer-shadow bg-primary relative"
        style={{ borderRadius: "16px" }}
      >
        <div className="absolute top-0 right-0 p-2">
          <Tooltip content={<TooltipContent />}>
            <div>
              <Icon name="info" size={40} color="currentColor" />
            </div>
          </Tooltip>
        </div>

        <div
          className="flex flex-col justify-between items-center"
          style={{ padding: "60px" }}
        >
          <Button
            size="lg"
            className="text-3xl bg-primary shadow-outer-shadow"
            style={{ border: "solid 1px black" }}
            onClick={handleGenerateSampleData}
          >
            Generate sample data
          </Button>
          <Gap size={32} />
          <p className="text-3xl">Or</p>
          <Gap size={32} />
          <FileDropzone />
        </div>
      </div>
    </div>
  );
}
