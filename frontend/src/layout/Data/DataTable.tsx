import { Task } from "@/common/types";
import { useTaskContext } from "@/context/TaskContext";
import {
  getKeyValue,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

interface Column {
  key: string;
  label: string;
}

export default function DataTable() {
  const { tasks } = useTaskContext();
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(tasks.length / rowsPerPage);

  const tableData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return tasks.slice(start, end);
  }, [page, tasks]);

  const mapTasksToTableData = (tasks: Array<Task>) => {
    return tasks.map((task) => {
      return {
        id: task.id,
        R: task.r,
        P: task.p,
        Q: task.q,
      };
    });
  };

  const columns: Array<Column> = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "R",
      label: "R",
    },
    {
      key: "P",
      label: "P",
    },
    {
      key: "Q",
      label: "Q",
    },
  ];

  return (
    <Table
      aria-label="Example table with dynamic content"
      isStriped={true}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            classNames={{
                cursor: "text-black",
                item: "text-black",
            }}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={mapTasksToTableData(tableData)}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
