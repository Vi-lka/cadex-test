"use client";

import Controls from "@/components/controls";
import CameraControls from "@/components/custom/camera-controls";
import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <Controls className="w-1/3 md:w-1/4" />
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

        <CameraControls />
      </Canvas>
      <Stats showPanel={0} className=""/>
    </div>
  );
}
