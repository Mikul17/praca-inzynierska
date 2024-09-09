"use client";

import useWindowSize from "@/hooks/WindowSizeContext";
import Footer from "@/layout/Footer";
import Gap from "@/layout/Gap";
import Header from "@/layout/Header";
import PageContent from "@/layout/PageContent";


export default function Home() {
  const {width, height} = useWindowSize();
  const headerHeight = 48;
  const footerHeight = 48;
  const gapHeight = 16;
  const pageContentHeight = height - headerHeight - footerHeight - gapHeight * 2;

  return (
    <main className={`w-${width} h-[${height}] overflow-hi min-w-[800px] min-h-[600px]`}>
      <Header height={headerHeight}/>
      <Gap height={gapHeight}/>
      <PageContent height={pageContentHeight}/>
      <Gap height={gapHeight}/>
      <Footer height={footerHeight}/>
    </main>
  );
}
