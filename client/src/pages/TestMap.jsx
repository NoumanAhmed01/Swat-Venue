import React from "react";
import Map from "../components/Map";

const TestMap = () => {
  return (
    <div className="h-screen w-screen p-10">
      <div className="h-[500px] border border-blue-500">
        <Map center={[-74.5, 40]} zoom={10} />
      </div>
    </div>
  );
};

export default TestMap;
