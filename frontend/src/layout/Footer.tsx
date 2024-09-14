import FormatDropdown from "@/components/footer/FormatDropdown";
import { Button } from "@nextui-org/button";

interface FooterProps {
    height: number | string;
}

export default function Footer({ height }: FooterProps) {
    return (
        <div className="flex justify-center items-center" style={{ height }}>
            <div className="flex spacing-x-3 bg-primary shadow-outer-shadow w-64">
            <Button className="bg-secondary">test</Button>
            <FormatDropdown />
            <Button color="success">Download</Button>
            </div>
        </div>
    )
}