import { Button } from "@nextui-org/button";
import FileDropzone from "@/components/FileDropzone";
import Gap from "./Gap";

interface PageContentProps {
    height: number | string;
}


export default function PageContent({ height }: PageContentProps) {
  return (
    <div className={`flex justify-center items-center`} style={{ height }}>
    <div className="flex flex-col justify-between items-center shadow-outer-shadow bg-primary " style={{padding: "60px", borderRadius:"16px"}}>
        <Button size="lg" className="text-3xl bg-primary shadow-outer-shadow" style={{border:"solid 1px black"}}>
          Generate sample data
        </Button>
        <Gap height={32}/>
      <p className="text-3xl">Or</p>
      <Gap height={32}/>
        <FileDropzone />
    </div>
  </div>
);
};
