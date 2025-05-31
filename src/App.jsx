// App.jsx
import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { DirectionalLightHelper } from 'three';
import Ipod from './components/Ipod';

function LightWithHelper() {
  const lightRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (!lightRef.current) return;

    const helper = new DirectionalLightHelper(lightRef.current, 1, 0xff0000);
    scene.add(helper);

    return () => scene.remove(helper);
  }, [scene]);

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[2, 5, -20]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <ambientLight  />
    </>
  );
}

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <Environment preset="studio" intensity={0.1}/>
        {/* <LightWithHelper /> */}
        <Ipod position={[0, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
