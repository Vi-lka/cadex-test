"use client";

import React from "react";
import ControlBar, { ControlButtons, PrimitivesList } from "@/components/control-bar";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { type PrimitiveGroup } from "@/types";

export default function Home() {
  // In real big project I could use zustand if want "Redux" type of state managment, or Jotai for atomic state managment (depends on the architecture and use case)
  const [primitiveGroups, setPrimitiveGroups] = React.useState<PrimitiveGroup[]>([])
  const [selectedPrimitiveId, setSelectedPrimitiveId] = React.useState<string | null>(null)

  const allPrimitives = primitiveGroups.flatMap((group) => group.primitives)

  console.log(allPrimitives)
  console.log(selectedPrimitiveId)

  const clearScene = () => {
    setPrimitiveGroups([])
    setSelectedPrimitiveId(null)
  }

  return (
    <div className="min-h-screen flex">
      <ControlBar className="w-1/3 md:w-1/4">
        <PrimitivesList 
          primitives={allPrimitives} 
          selectedPrimitiveId={selectedPrimitiveId} 
          onPrimitiveSelect={setSelectedPrimitiveId} 
        />
        <ControlButtons 
          primitivesLength={allPrimitives.length}
          onAddPrimitiveGroup={(group) => setPrimitiveGroups((prev) => [...prev, group])}
          onClearScene={clearScene}
        />
      </ControlBar>
      <Canvas 
        fallback={<div>Sorry no WebGL supported!</div>}
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="main-canvas"
      >
        {/* Light and Helpers */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <gridHelper args={[20, 20]} />
        <axesHelper args={[5]} />

        {/* Camera controls */}
        <OrbitControls />
      </Canvas>
      <Stats showPanel={0} className=""/>
    </div>
  );
}
