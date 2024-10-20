import { useAlgorithm, AlgorithmType, AlgorithmTypeKeys, AlgorithmDisplayNames } from "@/context/AlgorithmContext";
import { Select, SelectItem } from "@nextui-org/select";

export default function AlgorithmSelector() {
  const { currentAlgorithm, setCurrentAlgorithm } = useAlgorithm();

  return (
    <Select<typeof AlgorithmType>
      className="w-64"
      classNames={{
        base: "!rounded-l-none !rounded-r-2xl shadow-outer-shadow",
        trigger: "!rounded-l-none text-black",
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
