import React, { useEffect, useRef, useState } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { MeshPhysicalMaterial, SRGBColorSpace, TextureLoader } from 'three';

export default function Ipod(props) {
  const gltf = useGLTF('/ipod_with_screen.glb');
  const groupRef = useRef();
  const screenRef = useRef();
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    if (!groupRef.current) return;

    const loader = new TextureLoader();
    loader.load('/51uKuWtPQAL._UF1000,1000_QL80_.jpg', (texture) => {
      const screenMesh = groupRef.current.getObjectByName('screen');
      if (screenMesh) {
        // Create new material with the loaded texture and original settings
        const origMat = screenMesh.material;
        texture.flipY = false;
        texture.center.set(0.5, 0.5); // set pivot to center
        texture.rotation = 0;
        texture.matrixAutoUpdate = false;

        // Horizontal flip matrix:
        texture.matrix.set(
          -1, 0, 1,
          0, 1, 0,
          0, 0, 1
        );

        texture.needsUpdate = true;
        texture.colorSpace = SRGBColorSpace;
        screenRef.current = screenMesh;

        screenMesh.material = new MeshPhysicalMaterial({
          map: texture,
          roughness: origMat.roughness !== undefined ? origMat.roughness : 0.5,
          metalness: origMat.metalness !== undefined ? origMat.metalness : 0,
          ior: origMat.ior !== undefined ? origMat.ior : 1.5,
          emissive: origMat.emissive ? origMat.emissive.clone() : undefined,
          emissiveIntensity: origMat.emissiveIntensity || 0,
          // add other props if needed from origMat
        });
        screenMesh.material.needsUpdate = true;
        setShowUI(true); // trigger render of Html
        console.log('✅ Replaced material with textured material');


      } else {

        console.warn('⚠️ screen mesh not found');
      }
    });
  }, []);

  return (
    <>
      <primitive object={gltf.scene} ref={groupRef} {...props} />
      {showUI && screenRef.current && (
        <Html
          transform
          occlude
          position={screenRef.current.position.toArray()}
          rotation={screenRef.current.rotation.toArray()}
          zIndexRange={[100, 0]}
          style={{
            width: '70%',
            height: '25%',
            backgroundColor: 'red',
            borderRadius: '6px',
          }}
        />
      )
      }
    </>

  );
}

useGLTF.preload('/ipod.glb');
