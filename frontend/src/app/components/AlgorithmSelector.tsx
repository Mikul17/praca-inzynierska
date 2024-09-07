import { Select, SelectItem } from "@nextui-org/select";

export default function AlgorithmSelector() {
  const algorithms = [
    "Simulated Annealing",
    "Tabu Search",
    "Schrage Algorithm",
    "Carlier Algorithm",
  ];

  return (
    <Select
      className="w-64 !rounded-l-none !rounded-r-s"
      classNames={{
        trigger: "!rounded-l-none !rounded-r-2xl text-black",
        listbox: "!rounded-l-none !rounded-r-md",
        spinner: "text-black"
      }}
      size="lg"
      placeholder="Select an algorithm"
    >
      {algorithms.map((algorithm) => (
        <SelectItem key={algorithm} value={algorithm}>
          {algorithm}
        </SelectItem>
      ))}
    </Select>
  );
}
