import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, MeshPhysicalMaterial } from 'three';
import { useAtomValue } from 'jotai';
import { screenMaterialAtom } from '../lib/applyScreenTexture';

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

  const mat = screenMaterial.clone();
  mat.map = texture;
  mat.transparent = true;
  mat.depthWrite = false;
  mat.depthTest = false;
  mat.needsUpdate = true;
  return mat;
}, [screenMaterial, texture]);


  return (
    <mesh
      position={position}
      material={material}
      onPointerDown={onClick}
    >
      <planeGeometry args={size} />
    </mesh>
  );
}
