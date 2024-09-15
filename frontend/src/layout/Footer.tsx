"use client";
import FormatDropdown from "@/components/footer/FormatDropdown";
import { Button } from "@nextui-org/button";
import Gap from "./Gap";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useFile } from "@/hooks/FileContext";

interface FooterProps {
  height: number | string;
}

export default function Footer({ height }: FooterProps) {
    const {isFileLoaded, downloadFile} = useFile()
    const [orderOnly, setIsOrderOnly] = useState<boolean>(false);
    const [selectedFormat, setSelectedFormat] = useState<string>();

    const handleDownload = () => {
      if (selectedFormat && (selectedFormat === "csv" || selectedFormat === "txt")) {
        downloadFile(selectedFormat, orderOnly);
      }
    };

  return (
    <div className="flex justify-center items-center" style={{ height }}>
      <div
        className="flex bg-primary shadow-outer-shadow"
        style={{ borderRadius: "16px", padding: "8px", marginBottom: "32px" }}
      >
        <FormatDropdown selectedFormat={selectedFormat} setSelectedFormat={setSelectedFormat}/>
        <Gap size={"16px"} orientation="vertical" />
        <Checkbox
        isSelected={orderOnly}
        onValueChange={setIsOrderOnly}
        color="success"
        classNames={{
            wrapper: "bg-secondary",
          }}
        >Order only</Checkbox>
        <Gap size={"16px"} orientation="vertical" />
        <Button 
        color="success" 
        isDisabled={!isFileLoaded || !(selectedFormat === "csv" || selectedFormat === "txt")}
        onClick={handleDownload}
        >Download</Button>
      </div>
    </div>
  );
}
