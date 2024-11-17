import { useAlgorithm } from "@/context/AlgorithmContext";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import AlgorithmSelectorModal from "./AlgorithmSelectorModal";
import Icon from "../Icon";
import { useState } from "react";

export default function ParametersButton() {
  const { currentAlgorithm } = useAlgorithm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip
        isOpen={isHovered && currentAlgorithm === "CarlierAlgorithm"}
        content="Carlier algorithm takes no parameters"
        placement="top"
      >
          <Button
            startContent={
              <Icon name="parameter" size={20} color="currentColor" />
            }
            className="shadow-outer-shadow bg-secondary hover:bg-primary"
            size="lg"
            onClick={onOpen}
            isDisabled={
              !currentAlgorithm ||
              currentAlgorithm === "CarlierAlgorithm"
            }
          >
            Parameters
          </Button>
      </Tooltip>
      <AlgorithmSelectorModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
