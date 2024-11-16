import Gap from "@/layout/Gap";

interface TextDisplayProps {
    header?: string;
    margin?: string;
    children: React.ReactNode;
}

export default function TextDisplay({ header, children, margin }: TextDisplayProps) {
    return (
        <div
            className="flex flex-col bg-secondary p-4 shadow-outer-shadow"
            style={{ borderRadius: "1rem", margin: margin }}
        >
            <div className="text-md">{header}</div>
            <Gap size={8} orientation="vertical" />
            {children}
        </div>
    );
}
