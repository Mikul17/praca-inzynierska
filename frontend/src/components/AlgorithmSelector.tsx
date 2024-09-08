import { Select, SelectItem } from "@nextui-org/select";
import {
  useAlgorithm,
  AlgorithmType,
  AlgorithmDisplayNames,
  AlgorithmTypeKeys,
} from "../providers/context/AlgorithmContext";

export default function AlgorithmSelector() {
  const { currentAlgorithm, setCurrentAlgorithm } = useAlgorithm();

  return (
    <Select<typeof AlgorithmType>
      className="w-64 !   rounded-l-none !rounded-r-s"
      classNames={{
        trigger: "!rounded-l-none !rounded-r-2xl text-black",
        spinner: "text-black",
      }}
      size="lg"
      placeholder="Select an algorithm"
      selectedKeys={currentAlgorithm ? [currentAlgorithm] : []}
      onChange={(e) => setCurrentAlgorithm(e.target.value as AlgorithmTypeKeys)}
      aria-label="Select an algorithm"
      disabledKeys={[currentAlgorithm]}
    >
      {Object.values(AlgorithmType).map((algorithm) => (
        <SelectItem
          key={algorithm}
          value={algorithm}
          className={
            algorithm === currentAlgorithm
              ? "bg-black text-white"
              : "text-black"
          }
        >
          {AlgorithmDisplayNames[algorithm]}
        </SelectItem>
      ))}
    </Select>
  );
}
