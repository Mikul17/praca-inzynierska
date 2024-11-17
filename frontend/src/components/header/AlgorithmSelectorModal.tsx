"use client";
import { AlgorithmApiNames, useAlgorithm } from "@/context/AlgorithmContext";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import {  useCallback, useEffect, useMemo, useState } from "react";
import CustomSwitch from "../common/CustomSwitch";
import { useParameters } from "@/context/ParameterContext";
import { useFile } from "@/context/FileContext";

interface AlgorithmSelectorModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function AlgorithmSelectorModal({
  isOpen,
  onOpenChange,
}: AlgorithmSelectorModalProps) {
  const { currentAlgorithm } = useAlgorithm();
  const { algorithmParameters, setParameters } = useParameters();
  const { fileTasks } = useFile();
  const [initialTemperature, setInitialTemperature] = useState<number>(
    algorithmParameters?.parameters?.initialTemperature
  );
  const [coolingRate, setCoolingRate] = useState<number>(algorithmParameters?.parameters?.coolingRate);
  const [maxIterations, setMaxIterations] = useState<number>(algorithmParameters?.parameters?.maxIterations);
  const [tabuListSize, setTabuListSize] = useState<number>(algorithmParameters?.parameters?.tabuListSize);
  const [isTenureDynamic, setIsTenureDynamic] = useState<boolean>(algorithmParameters?.parameters?.isTenureDynamic);
  const [initialTenure, setInitialTenure] = useState<number>(algorithmParameters?.parameters?.initialTenure);
  const [preemptive, setPreemptive] = useState<boolean>(algorithmParameters?.parameters?.preemptive);

  const reloadInputs = () => {
    setInitialTemperature(undefined);
    setCoolingRate(undefined);
    setMaxIterations(undefined);
    setTabuListSize(undefined);
    setIsTenureDynamic(false);
    setInitialTenure(undefined);
    setPreemptive(false);
  }

  const validateValue = (value: number, min: number, max?: number): number => {
    if (value < min) return min;
    if(max && value > max) return max;
    return value;
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    setValue: (val: number) => void,
    min: number,
    max?: number
  ) => {
    const value = Number(e.target.value);
    if(max){
      setValue(validateValue(value, min, max));
    }else{
      setValue(validateValue(value, min));
    }
  };

  const generateContentByAlgorithm = useMemo(() => {
    switch (currentAlgorithm) {
      case "SimulatedAnnealing":
        return (
          <>
            <Input
              label="Initial Temperature"
              type="number"
              min={1}
              classNames={{ base: "shadow-outer-shadow rounded-xl" }}
              value={initialTemperature ? initialTemperature.toString() : ""}
              onChange={(e) => setInitialTemperature(Number(e.target.value))}
              onBlur={(e) => handleBlur(e, setInitialTemperature, 1)}
            />
            <Input
              label="Cooling Rate"
              type="number"
              step={0.01}
              classNames={{ base: "shadow-outer-shadow rounded-xl" }}
              value={coolingRate? coolingRate.toString() : ""}
              onChange={(e) => setCoolingRate(Number(e.target.value))}
              onBlur={(e) => handleBlur(e, setCoolingRate, 0, 1)}
            />
            <Input
              label="Max Iterations"
              type="number"
              classNames={{ base: "shadow-outer-shadow rounded-xl" }}
              value={maxIterations ? maxIterations.toString() : ""}
              onChange={(e) => setMaxIterations(Number(e.target.value))}
              onBlur={(e) => handleBlur(e, setMaxIterations, 1, 100000)}
            />
          </>
        );
      case "TabuSearch":
        return (
          <>
            <CustomSwitch
              label="Use Dynamic Tenure"
              checked={isTenureDynamic}
              onChange={setIsTenureDynamic}
            />
            <Input
              label="Max Iterations"
              type="number"
              min={1}
              max = {100000}
              classNames={{ base: "shadow-outer-shadow rounded-xl" }}
              value={maxIterations ? maxIterations.toString() : ""}
              onChange={(e) => setMaxIterations(Number(e.target.value))}
              onBlur={(e) => handleBlur(e, setMaxIterations, 1, 100000)}
            />
            {isTenureDynamic ? (
               <Input
               label="Initial Tenure"
               type="number"
               classNames={{ base: "shadow-outer-shadow rounded-xl" }}
               value={initialTenure ? initialTenure.toString() : ""}
               onChange={(e) => setInitialTenure(Number(e.target.value))}
              onBlur={(e) => handleBlur(e, setInitialTenure, 1)}
             />
             
            ) : (
              <Input
                label="Tabu List Size"
                type="number"
                min = {1}
                max={fileTasks.length - 2}
                classNames={{ base: "shadow-outer-shadow rounded-xl" }}
                value={tabuListSize? tabuListSize.toString() : ""}
                onChange={(e) => setTabuListSize(Number(e.target.value))}
                onBlur={(e) => handleBlur(e, setTabuListSize, 1, fileTasks.length - 2)}
              />
            )}
          </>
        );
      case "SchrageAlgorithm":
        return (
          <CustomSwitch
            label="Preemptive"
            checked={preemptive}
            onChange={setPreemptive}
          />
        );
    }
  }, [
    currentAlgorithm,
    algorithmParameters,
    initialTemperature,
    coolingRate,
    maxIterations,
    tabuListSize,
    isTenureDynamic,
    initialTenure,
    preemptive,
    onOpenChange,
    reloadInputs
  ]);

  const formatAlgorithmName = () => {
    switch (currentAlgorithm) {
      case "SimulatedAnnealing":
        return "Simulated Annealing";
      case "TabuSearch":
        return "Tabu Search";
      case "SchrageAlgorithm":
        return "Schrage Algorithm";
    }
  };


  const resetInputs = useCallback(() => {
    setInitialTemperature(
      algorithmParameters?.parameters?.initialTemperature ?? undefined
    );
    setCoolingRate(algorithmParameters?.parameters?.coolingRate ?? undefined);
    setMaxIterations(algorithmParameters?.parameters?.maxIterations ?? undefined);
    setTabuListSize(algorithmParameters?.parameters?.tabuListSize ?? undefined);
    setIsTenureDynamic(algorithmParameters?.parameters?.isTenureDynamic ?? false);
    setInitialTenure(algorithmParameters?.parameters?.initialTenure ?? undefined);
    setPreemptive(algorithmParameters?.parameters?.preemptive ?? false);
  }, [algorithmParameters]);
  

  const handleClose = useCallback(() => {
    resetInputs();
    onOpenChange();
  }, [resetInputs, onOpenChange]);

  const submitParameters = () => {
    const parameters: Record<string, any> = {};
    const timeoutDuration =
      currentAlgorithm === "SimulatedAnnealing" ||
      currentAlgorithm === "TabuSearch"
        ? 10
        : 1;
    switch (currentAlgorithm) {
      case "SimulatedAnnealing":
        parameters.initialTemperature = initialTemperature;
        parameters.coolingRate = coolingRate;
        parameters.maxIterations = maxIterations;
        break;
      case "TabuSearch":
        parameters.maxIterations = maxIterations;
        parameters.tabuListSize = tabuListSize;
        parameters.isTenureDynamic = isTenureDynamic;
        parameters.initialTenure = initialTenure;
        break;
      case "SchrageAlgorithm":
        parameters.preemptive = preemptive;
        break;
      case "CarlierAlgorithm":
        break;
    }
    if(!setParameters(fileTasks, currentAlgorithm, timeoutDuration, parameters)) {
      resetInputs();
      return;
    }
    onOpenChange();
  };


  useEffect(() => {
    if (algorithmParameters?.parameters) {
      setInitialTemperature(algorithmParameters.parameters.initialTemperature ?? undefined);
      setCoolingRate(algorithmParameters.parameters.coolingRate ?? undefined);
      setMaxIterations(algorithmParameters.parameters.maxIterations ?? undefined);
      setTabuListSize(algorithmParameters.parameters.tabuListSize ?? undefined);
      setIsTenureDynamic(algorithmParameters.parameters.isTenureDynamic ?? false);
      setInitialTenure(algorithmParameters.parameters.initialTenure ?? undefined);
      setPreemptive(algorithmParameters.parameters.preemptive ?? false);
    }
  }, [algorithmParameters]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton={true}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Provide parameters for: {formatAlgorithmName()}
            </ModalHeader>
            <ModalBody>{generateContentByAlgorithm}</ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={handleClose}>
                Close
              </Button>
              <Button color="default" onPress={reloadInputs} className="text-black">
                Reset
              </Button>
              <Button
                color="success"
                onPress={submitParameters}
                className="text-white"
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
