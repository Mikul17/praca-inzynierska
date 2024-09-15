import { Divider } from "@nextui-org/react";


export default function TooltipContent() {
    return (
        <div className="px-1 py-2 flex flex-col items-center">
        <div className="text-small font-bold">Data format</div>
        <div className="text-tiny">File should contain data in following format:</div>
        <div className="flex h-5 items-center space-x-4 text-small">
          <div className="px-3 font-bold">R</div>
          <Divider orientation="vertical" className="bg-black" />
          <div className="px-3 font-bold">P</div>
          <Divider orientation="vertical" className="bg-black" />
          <div className="px-3 font-bold">Q</div>
        </div>
        <div className="text-tiny">Each value must be divided by comma ","</div>
        <div className="text-tiny">File should not contain header, just raw data</div>
      </div>
    )
}