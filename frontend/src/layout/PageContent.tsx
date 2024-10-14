"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTaskContext } from "@/context/TaskContext";
import FileDropzone from "@/components/content/FileDropzone";

interface PageContentProps {
  height: number | string;
}

// Dynamiczny import z wyłączonym SSR
const GanttChart = dynamic(() => import("../components/content/GanttChart"), {
  ssr: false,
});

export default function PageContent({ height }: PageContentProps) {
  const { tasks, setOrder } = useTaskContext();
  const [inputValue, setInputValue] = useState("");

  const updateChart = () => {
    const order = inputValue
      .trim()
      .split(",")
      .map((idStr) => parseInt(idStr, 10))
      .filter((id) => !isNaN(id));
    console.log(order);
    console.log(tasks);
    if (order.length > tasks.length) {
      toast.error("Invalid order");
      return;
    }
    setOrder(order);
  };

  return (
    <div style={{ width: "1000px" }}>
      <Input
        placeholder="Wpisz kolejność zadań (np. 1 2 3)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        width="300px"
      />
      <Button onClick={updateChart}>Zaktualizuj wykres</Button>
      <Button onClick={updateChart}>Odtwórz animację</Button>
      <GanttChart />
      <FileDropzone />
    </div>
  );

  // return (
  //   <div
  //     className="flex justify-center items-center flex-col"
  //     style={{ height }}
  //   >
  //     <div
  //       className="flex flex-col shadow-outer-shadow bg-primary relative"
  //       style={{ borderRadius: "16px" }}
  //     >
  //       <div className="absolute top-0 right-0 p-2">
  //         <Tooltip content={<TooltipContent />}>
  //           <div>
  //             <Icon name="info" size={40} color="currentColor" />
  //           </div>
  //         </Tooltip>
  //       </div>

  //       <div
  //         className="flex flex-col justify-between items-center"
  //         style={{ padding: "60px" }}
  //       >
  //         <Button
  //           size="lg"
  //           className="text-3xl bg-primary shadow-outer-shadow"
  //           style={{ border: "solid 1px black" }}
  //           onClick={handleDataGeneration}
  //         >
  //           Generate sample data
  //         </Button>
  //         <Gap size={32} />
  //         <p className="text-3xl">Or</p>
  //         <Gap size={32} />
  //         <FileDropzone />
  //       </div>
  //     </div>
  //   </div>
  // );
}

/*Old design, keep just in case */
//   return (
//     <div className={`flex justify-center items-center flex-col`} style={{ height }}>
//         <div
//           className="flex flex-col shadow-outer-shadow bg-primary "
//           style={{ borderRadius: "16px"}}
//         >
//           <div style={{width:"40px", height:"40px"}}>
//           <Tooltip content={<TooltipContent />}>
//             <div>
//               <Icon name="info" size={40} color="currentColor" />
//             </div>
//           </Tooltip>
//           </div>

//           <div className="flex flex-col justify-between items-center" style={{ padding: "60px", paddingTop: "10px"}}>
//           <Button
//             size="lg"
//             className="text-3xl bg-primary shadow-outer-shadow"
//             style={{ border: "solid 1px black" }}
//             onClick={handleDataGeneration}
//           >
//             Generate sample data
//           </Button>
//           <Gap height={32} />
//           <p className="text-3xl">Or</p>
//           <Gap height={32} />
//           <FileDropzone />
//           </div>

//         </div>
//     </div>
//   );
// }
