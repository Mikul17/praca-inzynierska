interface GapProps {
  orientation?: "vertical" | "horizontal";
  size: number | string;
}

export default function Gap({
  size: height,
  orientation = "horizontal",
}: GapProps) {
  if (orientation === "vertical") {
    return <div style={{ width: height }} />;
  }

  return <div style={{ height }}></div>;
}
