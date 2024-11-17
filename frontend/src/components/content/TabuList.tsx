import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from "@nextui-org/react";

interface Column {
  key: string;
  label: string;
}

export default function TabuList() {
  const { tabuList } = useTaskContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Calculate the items for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = tabuList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <Table aria-label="Tabu List Table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={currentItems}>
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
      <Pagination
        total={Math.ceil(tabuList.length / itemsPerPage)}
        initialPage={1}
        page={currentPage}
        onChange={(page) => setCurrentPage(page)}
        className="mt-4"
      />
    </div>
  );
}
