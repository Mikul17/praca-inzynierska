import { Button } from "@nextui-org/button";
import Gap from "./Gap";
import { useFile } from "@/hooks/FileContext";
import { Tooltip } from "@nextui-org/react";
import TooltipContent from "@/components/content/TooltipInformation";
import Icon from "@/components/Icon";
import FileDropzone from "@/components/content/FileDropzone";

interface PageContentProps {
  height: number | string;
}

export default function PageContent({ height }: PageContentProps) {
  const { fileTasks, generateSampleTasks } = useFile();

  const handleDataGeneration = () => {
    generateSampleTasks(100);
  };

  return (
    <div className="flex justify-center items-center flex-col" style={{ height }}>
      <div
        className="flex flex-col shadow-outer-shadow bg-primary relative"
        style={{ borderRadius: "16px"}}
      >
        <div className="absolute top-0 right-0 p-2">
          <Tooltip content={<TooltipContent />}>
            <div>
              <Icon name="info" size={40} color="currentColor" />
            </div>
          </Tooltip>
        </div>
        
        <div className="flex flex-col justify-between items-center" style={{ padding: "60px"}}>
          <Button
            size="lg"
            className="text-3xl bg-primary shadow-outer-shadow"
            style={{ border: "solid 1px black" }}
            onClick={handleDataGeneration}
          >
            Generate sample data
          </Button>
          <Gap height={32} />
          <p className="text-3xl">Or</p>
          <Gap height={32} />
          <FileDropzone />
        </div>
      </div>
    </div>
  );
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
