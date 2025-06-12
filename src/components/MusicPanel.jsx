import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Euler, MeshBasicMaterial, MeshPhysicalMaterial, Quaternion } from 'three';
import { useAtomValue } from 'jotai';
import { applyScreenTexture, screenMaterialAtom } from '../lib/applyScreenTexture';
import Button from './Button';
import { songs } from '../lib/songs';
import { loadAndPlay, togglePlay } from '../lib/audioController';


export default function MusicPanel({ screenRef }) {
  const groupRef = useRef();
  const panelRef = useRef();

  // Hooks for controlling songs in playlist
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentSong = songs[currentIndex];



  // Loading and Playing First song in playlist
  useEffect(() => {
    loadAndPlay(currentSong, screenRef.current);
    setIsPlaying(true);
  }, [currentIndex]);

  // Handler Functions that set states and call audio controller functions
  const handleTogglePlay = () => {
    togglePlay();
    setIsPlaying(prev => !prev);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    loadAndPlay(songs[nextIndex], screenRef.current);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    loadAndPlay(songs[prevIndex], screenRef.current);
    setIsPlaying(true);
  };



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
      <Button
        type={isPlaying ? 'pause' : 'play'}
        position={[0, 0, 0]}

        onClick={handleTogglePlay}
      />
      <Button
        type="next"
        position={[0.8, 0, 0]}

        onClick={handleNext}
      />
      <Button
        type="previous"
        position={[-0.8, 0, 0]}

        onClick={handlePrev}
      />


    </group>
  );
}
