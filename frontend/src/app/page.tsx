"use client";

import { useFile } from "@/context/FileContext";
import useWindowSize from "@/context/WindowSizeContext";
import EmptyFilePageContent from "@/layout/EmptyFilePageContent";
import Footer from "@/layout/Footer";
import Gap from "@/layout/Gap";
import Header from "@/layout/Header";
import PageContent from "@/layout/PageContent";
import { Spinner } from "@nextui-org/spinner";

export default function Home() {
  const { height, isReady } = useWindowSize();
  const { isFileLoaded } = useFile();
  const headerHeight = 48;
  const footerHeight = 48;
  const gapHeight = 16;
  const pageContentHeight = Math.max(
    800 - headerHeight - footerHeight - gapHeight * 3,
    height - headerHeight - footerHeight - gapHeight * 3
  );

  if (!isReady) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner label="Loading page..." color="default" />
      </div>
    );
  }

  return (
    <main
      style={{
        width: "100%",
        minWidth: "800px",
        height: "100%",
        minHeight: "500px",
      }}
    >
      <Header height={headerHeight} />
      <Gap size={2 * gapHeight} />
      { isFileLoaded ? 
       <PageContent height={pageContentHeight} /> : 
       <EmptyFilePageContent height={pageContentHeight} />}
      <Gap size={gapHeight} />
      <Footer height={footerHeight} />
    </main>
  );
}
