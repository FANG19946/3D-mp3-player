import React from 'react';
import { Html } from '@react-three/drei';
import { Euler, Quaternion, Vector3 } from 'three';

export default function MusicPanel({ screenRef }) {
  if (!screenRef.current) return null;

  const worldPos = screenRef.current.getWorldPosition(new Vector3());
  const worldQuat = screenRef.current.getWorldQuaternion(new Quaternion());

  const correction = new Quaternion().setFromEuler(new Euler(0, -Math.PI / 2, 0));
  const correctedQuat = worldQuat.multiply(correction);

  return (
    <Html
      transform
      center
      occlude
      position={worldPos.clone().add(new Vector3(0, 0, 0.05)).toArray()}
      quaternion={correctedQuat}
      zIndexRange={[100, 0]}
    >
      <div
        className="bg-gray-800/70"
        style={{
          width: '100px',
          height: '50px',
          borderRadius: '6px',
          pointerEvents: 'auto',
          backfaceVisibility: 'hidden',
        }}
      />
    </Html>
  );
}
