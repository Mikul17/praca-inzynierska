import Gap from "@/layout/Gap";

interface CustomTreeNodeProps {
  header: string;
  isPruned: boolean;
  isActive: boolean;
  ub: number;
  lb: number;
  cmax: number;
}

export default function CustomTreeNode({ header, isPruned, isActive, ub, lb, cmax }: CustomTreeNodeProps) {


  const getStyle = (active: boolean, pruned: boolean) => {
    if (active) {
      return "flex flex-col p-4 shadow-outer-shadow bg-green-700 text-white";
    } else if (pruned) {
      return "flex flex-col p-4 shadow-outer-shadow bg-red-700 text-white";
    } else {
      return "flex flex-col p-4 shadow-outer-shadow bg-secondary text-black";
    }
  };

  return (
    <div
      className={getStyle(isActive, isPruned)}
      style={{
        borderRadius: "1rem",
      }}
    >
      <div className="text-md">{header}</div>
      <Gap size={8} orientation="vertical" />
      <div className="flex flex-col">
        <div className="text-md">UB: {ub}</div>
        <div className="text-md">LB: {lb}</div>
        <div className="text-md">Cmax: {cmax}</div>
    </div>
    </div>
  );
}
