import FileDropzone from "@/components/content/FileDropzone";
import TooltipContent from "@/components/content/TooltipInformation";
import Icon from "@/components/Icon";
import {
  Tooltip,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Slider,
} from "@nextui-org/react";
import Gap from "./Gap";
import { useFile } from "@/context/FileContext";
import { useState } from "react";

interface LayoutProps {
  height: number | string;
}

export default function EmptyFilePageContent({ height }: LayoutProps) {
  const { generateSampleTasks } = useFile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [taskAmount, setTaskAmount] = useState(15);
  const [maxR, setMaxR] = useState(100);
  const [maxP, setMaxP] = useState(100);
  const [maxQ, setMaxQ] = useState(100);

  const handleGenerateSampleData = () => {
    console.log(`Generating ${taskAmount} tasks with maxR: ${maxR}, maxP: ${maxP}, maxQ: ${maxQ}`);
    generateSampleTasks(taskAmount, maxR, maxP, maxQ);
  };

  const handleClose = () => {
    onOpenChange();
    setTaskAmount(15);
    setMaxR(100);
    setMaxP(100);
    setMaxQ(100);
  };

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
            onClick={onOpen}
          >
            Generate sample data
          </Button>
          <Gap size={32} />
          <p className="text-3xl">Or</p>
          <Gap size={32} />
          <FileDropzone />

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Generate Sample Data
                  </ModalHeader>
                  <ModalBody>
                    <Slider
                      size="lg"
                      step={1}
                      color="foreground"
                      label="Number of tasks"
                      maxValue={50}
                      minValue={1}
                      defaultValue={15}
                      value={taskAmount}
                      onChange={(value) => setTaskAmount(Array.isArray(value) ? value[0] : value)}
                      className="max-w-md"
                    />
                    <Slider
                      size="lg"
                      step={1}
                      color="foreground"
                      label="Max R - release time"
                      maxValue={1000}
                      minValue={1}
                      defaultValue={100}
                      value={maxR}
                      onChange={(value) => setMaxR(Array.isArray(value) ? value[0] : value)}
                      className="max-w-md"
                    />
                    <Slider
                      size="lg"
                      step={1}
                      color="foreground"
                      label="Max P - processing time"
                      maxValue={1000}
                      minValue={1}
                      defaultValue={100}
                      value={maxP}
                      onChange={(value) => setMaxP(Array.isArray(value) ? value[0] : value)}
                      className="max-w-md"
                    />
                    <Slider
                      size="lg"
                      step={1}
                      color="foreground"
                      label="Max q - delivery time"
                      maxValue={1000}
                      minValue={1}
                      defaultValue={100}
                      value={maxQ}
                      onChange={(value) => setMaxQ(Array.isArray(value) ? value[0] : value)}
                      className="max-w-md"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={handleClose}>
                      Close
                    </Button>
                    <Button color="success" onPress={handleGenerateSampleData} className="text-white">
                      Generate
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}
