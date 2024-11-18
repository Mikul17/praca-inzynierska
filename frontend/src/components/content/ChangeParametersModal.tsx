import { useAlgorithm } from "@/context/AlgorithmContext";
import { useFile } from "@/context/FileContext";
import { useParameters } from "@/context/ParameterContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ChangeParametersModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export default function ChangeParametersModal({ isOpen, onOpenChange }: ChangeParametersModalProps) {
    const { currentAlgorithm } = useAlgorithm();
    const { algorithmParameters, updateParameter } = useParameters();
    const { fileTasks } = useFile();
    const { sendUpdateCoolingRate, sendUpdateTabuListSize, sendUpdateInitialTenure } = useWebSocket();

    const [coolingRate, setCoolingRate] = useState<number | undefined>(algorithmParameters?.parameters?.coolingRate);
    const [tabuListSize, setTabuListSize] = useState<number | undefined>(algorithmParameters?.parameters?.tabuListSize);
    const [initialTenure, setInitialTenure] = useState<number | undefined>(algorithmParameters?.parameters?.initialTenure);

    useEffect(() => {
        if (isOpen) {
            setCoolingRate(algorithmParameters?.parameters?.coolingRate);
            setTabuListSize(algorithmParameters?.parameters?.tabuListSize);
            setInitialTenure(algorithmParameters?.parameters?.initialTenure);
        }
    }, [isOpen, algorithmParameters]);

    const validateValue = (value: number, min: number, max?: number): number => {
        if (value < min) return min;
        if (max && value > max) return max;
        return value;
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>,
        setValue: (val: number) => void,
        min: number,
        max?: number
    ) => {
        const value = Number(e.target.value);
        if (max) {
            setValue(validateValue(value, min, max));
        } else {
            setValue(validateValue(value, min));
        }
    };

    const generateContent = () => {
        switch (currentAlgorithm) {
            case "SimulatedAnnealing":
                return (
                    <Input
                        label="Cooling Rate"
                        type="number"
                        step={0.01}
                        classNames={{ base: "shadow-outer-shadow rounded-xl" }}
                        value={coolingRate !== undefined ? coolingRate.toString() : ""}
                        onChange={(e) => setCoolingRate(Number(e.target.value))}
                        onBlur={(e) => handleBlur(e, setCoolingRate, 0, 1)}
                    />
                );
            case "TabuSearch":
                if (algorithmParameters?.parameters?.isTenureDynamic) {
                    return (
                        <Input
                            label="Initial Tenure"
                            type="number"
                            classNames={{ base: "shadow-outer-shadow rounded-xl" }}
                            value={initialTenure !== undefined ? initialTenure.toString() : ""}
                            onChange={(e) => setInitialTenure(Number(e.target.value))}
                            onBlur={(e) => handleBlur(e, setInitialTenure, 1)}
                        />
                    );
                }
                return (
                    <Input
                        label="Tabu List Size"
                        type="number"
                        min={1}
                        max={fileTasks.length - 2}
                        classNames={{ base: "shadow-outer-shadow rounded-xl" }}
                        value={tabuListSize !== undefined ? tabuListSize.toString() : ""}
                        onChange={(e) => setTabuListSize(Number(e.target.value))}
                        onBlur={(e) => handleBlur(e, setTabuListSize, 1, fileTasks.length - 2)}
                    />
                );
            default:
                return null;
        }
    };

    const handleClose = () => {
        setCoolingRate(algorithmParameters?.parameters?.coolingRate);
        setTabuListSize(algorithmParameters?.parameters?.tabuListSize);
        setInitialTenure(algorithmParameters?.parameters?.initialTenure);
        onOpenChange();
    };

    const handleSave = () => {
        if(currentAlgorithm === "SimulatedAnnealing") {
            updateParameter('coolingRate', coolingRate);
            sendUpdateCoolingRate(coolingRate);
        } else if(currentAlgorithm === "TabuSearch") {
            if(algorithmParameters?.parameters?.isTenureDynamic) {
                updateParameter('initialTenure', initialTenure);
                sendUpdateInitialTenure(initialTenure);
            } else {
                updateParameter('tabuListSize', tabuListSize);
                sendUpdateTabuListSize(tabuListSize);
            }

        }
        onOpenChange();
    };

    return (
        <Modal isOpen={isOpen} onClose={onOpenChange} isDismissable={false} hideCloseButton={true}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="">
                            Change Parameters
                        </ModalHeader>
                        <ModalBody>{generateContent()}</ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button color="success" onClick={handleSave} className="text-white">
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
