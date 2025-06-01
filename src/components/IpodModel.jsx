import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { applyScreenTexture } from '../lib/applyScreenTexture';



export default function IpodModel({ groupRef, screenRef, onTextureApplied, ...props }) {
  const gltf = useGLTF('/ipod_with_screen.glb');

  useEffect(() => {
    if (!groupRef.current) return;

    const screenMesh = groupRef.current.getObjectByName('screen');
    if (screenMesh) {
      screenRef.current = screenMesh;
      applyScreenTexture(screenMesh, '/51uKuWtPQAL._UF1000,1000_QL80_.jpg', onTextureApplied);
    }
  }, [groupRef]);

  return <primitive object={gltf.scene} ref={groupRef} {...props} />;
}

useGLTF.preload('/ipod_with_screen.glb');
