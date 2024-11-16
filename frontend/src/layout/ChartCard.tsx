
interface ChartCardProps {
    children: React.ReactNode;
    height?: number;
    minHeight?: number;
}

export default function ChartCard({children, height}: ChartCardProps) {
  return (
    <div style={{ width: "50%" ,height: height}}>
      <div
        className="flex flex-col bg-secondary shadow-outer-shadow"
        style={{ borderRadius: "1rem", padding: "1rem",  minHeight: "250px" }}
      >
        {children}
      </div>
    </div>
  );
}
