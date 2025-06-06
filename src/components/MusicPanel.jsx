import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Euler, MeshBasicMaterial, MeshPhysicalMaterial, Quaternion } from 'three';
import { useAtomValue } from 'jotai';
import { screenMaterialAtom } from '../lib/applyScreenTexture';


export default function MusicPanel({ screenRef }) {
  const groupRef = useRef();
  const panelRef = useRef();
  //Using Atoms to get Screen Materials to get  
  const screenMaterial = useAtomValue(screenMaterialAtom)

  //Matching Panel Material to Screen Material
  const material = new MeshPhysicalMaterial({
    color: 'red',                     
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    depthTest: false,
    roughness: screenMaterial?.roughness ?? 0.5,
    metalness: screenMaterial?.metalness ?? 0,
    ior: screenMaterial?.ior ?? 1.5,
  });

  const correctionQuat = new Quaternion().setFromEuler(new Euler(0, Math.PI / 2, 0));
  const tempQuat = new Quaternion();

  useFrame(() => {
    if (!screenRef?.current || !groupRef.current) return;

    // Match position
    screenRef.current.getWorldPosition(groupRef.current.position);

    // Match rotation with correction
    screenRef.current.getWorldQuaternion(tempQuat);
    groupRef.current.quaternion.copy(tempQuat).multiply(correctionQuat);

    // Match scale (optional)
    groupRef.current.scale.copy(screenRef.current.scale);
  });


  return (
    <group ref={groupRef}>
      <mesh ref={panelRef} position={[0, 0, 0]} material={material}>
        {/* About 300x200 pixels, scaled to roughly fit your iPod model */}
        <planeGeometry args={[2.5, 1]} />
      </mesh>
    </group>
  );
}
