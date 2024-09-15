"use client";

import useWindowSize from "@/hooks/WindowSizeContext";
import Footer from "@/layout/Footer";
import Gap from "@/layout/Gap";
import Header from "@/layout/Header";
import PageContent from "@/layout/PageContent";
import { Spinner } from "@nextui-org/spinner";

export default function Home() {
  const { height, isReady } = useWindowSize();
  const headerHeight = 48;
  const footerHeight = 48;
  const gapHeight = 16;
  const pageContentHeight = Math.max(
    800 - headerHeight - footerHeight - gapHeight * 2,
    height - headerHeight - footerHeight - gapHeight * 2
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
      <Gap size={gapHeight} />
      <PageContent height={pageContentHeight} />
      <Gap size={gapHeight} />
      <Footer height={footerHeight} />
    </main>
  );
}
