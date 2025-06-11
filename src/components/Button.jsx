import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, MeshPhysicalMaterial } from 'three';
import { useAtomValue } from 'jotai';
import { screenMaterialAtom } from '../lib/applyScreenTexture';
import { makeButtonMaterial } from '../lib/makeButtonMaterial';

export default function Button({
  type,
  size = [0.2, 0.2],
  position = [0, 0, 0.01],
  onClick = () => {},
}) {
  const screenMaterial = useAtomValue(screenMaterialAtom);
  const texture = useLoader(TextureLoader, `/${type}.png`);

 const material = useMemo(() => {
  if (!screenMaterial || !texture) return null;
  return makeButtonMaterial(texture, screenMaterial);
}, [screenMaterial, texture]);



  return (
    <mesh
      position={position}
      material={material}
      onPointerDown={onClick}
      frustumCulled={false}
      renderOrder={1}
    >
      <planeGeometry args={size} />
    </mesh>
  );
}
