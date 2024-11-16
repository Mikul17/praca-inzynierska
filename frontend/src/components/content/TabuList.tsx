import { useTaskContext } from "@/context/TaskContext";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

interface Column {
  key: string;
  label: string;
}

export default function TabuList() {
  const { tabuList } = useTaskContext();

  const columns: Array<Column> = [
    {
      key: "firstTaskId",
      label: "First Task ID",
    },
    {
      key: "secondTaskId",
      label: "Second Task ID",
    },
    {
      key: "moveCmax",
      label: "Move Cmax",
    },
    {
      key: "tenure",
      label: "Tenure",
    },
  ];

  return (
    <div>
      <Table aria-label="Tabu List Table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={tabuList}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                {columnKey === "tenure" && item[columnKey] === -1
                  ? "-"
                  : getKeyValue(item, columnKey)}
              </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
