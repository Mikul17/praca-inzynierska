import DataTable from "./DataTable";


interface LayoutProps {
    readonly height: number;
}

export default function DataSection({ height }: LayoutProps) {

    return (
        <div style={{ height: height }} className="flex w-full h-full">
           <DataTable />
        </div>
    )

}