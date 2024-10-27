"use client";
import { useTaskContext } from "@/context/TaskContext";
import Gap from "@/layout/Gap";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

export default function Searchbar() {
  const [displayOrder, setDisplayOrder] = useState<Array<number>>([]);
  const { setOrder, tasks } = useTaskContext();

  return (
    <div
      className="flex justify-center items-center bg-secondary shadow-outer-shadow"
      style={{ borderRadius: "1rem", padding: "0.45rem" }}
    >
      <Input
        label="Display order"
        size="lg"
        onChange={(e) =>
          setDisplayOrder(
            e.target.value
              .split(",")
              .filter((x) => x.length > 0)
              .map((x) => parseInt(x))
          )
        }
      />
      <Gap size={16} orientation="vertical" />
      <Button
        className="shadow-outer-shadow bg-secondary hover:bg-primary"
        size="lg"
        onClick={() => setOrder(displayOrder)}
        isDisabled={ displayOrder.length === 0 || displayOrder.some((x) => isNaN(x)) }
      >
        Display
      </Button>
    </div>
  );
}
