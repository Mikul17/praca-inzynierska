"use client";

import AlgorithmSelector from "./components/AlgorithmSelector";

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hi">
      {/* <Header/> */}
      <div className="flex justify-center items-center">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Task Scheduler
        </h1>
      </div>
      <AlgorithmSelector/>
    </main>
  );
}
