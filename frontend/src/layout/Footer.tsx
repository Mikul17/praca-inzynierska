
interface FooterProps {
    height: number | string;
}

export default function Footer({ height }: FooterProps) {
    return (
        <div style={{ height }} className="bg-black">
            <p>footer</p>
        </div>
    )
}