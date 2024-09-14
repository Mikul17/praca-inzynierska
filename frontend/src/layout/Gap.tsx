

interface GapProps {
    height: number | string;
}


export default function Gap({ height }: GapProps) {
    return (
        <div style={{height}}></div>
    )
}
