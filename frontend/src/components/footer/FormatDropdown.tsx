import { ALLOWED_FILE_FORMATS } from "@/common/FileUtils";
import { SelectItem } from "@nextui-org/react";
import { Select } from "@nextui-org/select";
import { Dispatch, SetStateAction } from "react";

interface FormatDropdownProps {
  readonly selectedFormat: string | undefined;
  setSelectedFormat: Dispatch<SetStateAction<string | undefined>>;
}

export default function FormatDropdown({
  selectedFormat,
  setSelectedFormat,
}: FormatDropdownProps) {
  return (
    <Select
      className="w-32"
      fullWidth={false}
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
