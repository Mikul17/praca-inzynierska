"use client";

import Header from "@/layout/Header";


export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hi">
      <Header/>
      <div className="flex justify-center items-center flex-col bg-neutral-700">
        <h1 className="text-4xl font-bold">Welcome to the Sorting Visualizer</h1>
        <h2 className="text-2xl">No data provided</h2>
      </div>
    </main>
  );
}
