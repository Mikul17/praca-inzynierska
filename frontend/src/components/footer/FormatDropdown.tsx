import { ALLOWED_FILE_FORMATS } from "@/common/FileUtils";
import { SelectItem } from "@nextui-org/react";
import { Select } from "@nextui-org/select";
import { useState } from "react";

export default function FormatDropdown() {
  const [selectedFormat, setSelectedFormat] = useState<string>();

  return (
    <Select
    className="w-auto"
      placeholder="Format"
      onChange={(e) => setSelectedFormat(e.target.value)}
      selectedKeys={selectedFormat ? [selectedFormat] : []}
      aria-label="Select file format to export"
    >
      {ALLOWED_FILE_FORMATS.map((format) => (
        <SelectItem key={format} value={format}>
          {format}
        </SelectItem>
      ))}
    </Select>
  );
}
