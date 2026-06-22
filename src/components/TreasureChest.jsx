import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioSynth } from '../utils/audioSynth.js';

export default function TreasureChest({ position = [0, 0, 0], onFindTreasure }) {
  const hingeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(0);
  const openDurationRef = useRef(0);

  // Skill-based minigame logic: Randomly snap open for a short time
  useFrame((state, delta) => {
    timerRef.current += delta;
    
    if (isOpen) {
      // If open, close it after the open duration expires
      if (timerRef.current > openDurationRef.current) {
        setIsOpen(false);
        timerRef.current = 0;
      }
    } else {
      // If closed, wait a random interval (2 to 6 seconds) to pop open
      if (timerRef.current > Math.random() * 4 + 2) {
        setIsOpen(true);
        timerRef.current = 0;
        // Stay open for a very brief window (0.5 to 1.5 seconds)
        openDurationRef.current = Math.random() * 1.0 + 0.5;
      }
    }

    if (hingeRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2.5 : 0;
      hingeRef.current.rotation.x = THREE.MathUtils.damp(
        hingeRef.current.rotation.x,
        targetRotation,
        8, // Fast snap
        delta
      );
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isOpen) {
      // Success!
      if (onFindTreasure) onFindTreasure();
      try {
        audioSynth.playPowerUp();
      } catch (err) {}
      // Snap shut immediately after successful loot
      setIsOpen(false);
      timerRef.current = 0;
    }
  };

  // Memoize materials to prevent recreation
  const materials = useMemo(() => ({
    wood: new THREE.MeshStandardMaterial({ color: '#5C4033', roughness: 0.9 }),
    gold: new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 0.8, roughness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: '#3E2723', roughness: 1.0 })
  }), []);

  return (
    <group position={position} scale={0.5} onClick={handleClick}>
      <mesh visible={false} position={[0, 1.5, 0]}>
         {/* Invisible bounding box to make clicking easier */}
         <boxGeometry args={[4, 4, 3]} />
         <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* --- CHEST BASE --- */}
      <group position={[0, 1, 0]} pointerEvents="none">
        <mesh material={materials.wood}>
          <boxGeometry args={[3, 2, 2]} />
        </mesh>
        <mesh material={materials.gold} position={[-1.45, 0, 0]}>
          <boxGeometry args={[0.15, 2.05, 2.05]} />
        </mesh>
        <mesh material={materials.gold} position={[1.45, 0, 0]}>
          <boxGeometry args={[0.15, 2.05, 2.05]} />
        </mesh>
        <mesh material={materials.gold} position={[0, 0.8, 1.05]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
        </mesh>
        <mesh material={materials.dark} position={[0, 0.99, 0]}>
          <boxGeometry args={[2.8, 0.02, 1.8]} />
        </mesh>
        {/* Fake Gold Inside */}
        <mesh material={materials.gold} position={[0, 0.8, 0]}>
          <boxGeometry args={[2.5, 0.4, 1.5]} />
        </mesh>
      </group>

      {/* --- CHEST LID --- */}
      <group position={[0, 2, -1]} ref={hingeRef} pointerEvents="none">
        <group position={[0, 0, 1]}>
          <mesh material={materials.wood} position={[0, 0.25, 0]}>
            <boxGeometry args={[3, 0.5, 2]} />
          </mesh>
          <mesh material={materials.wood} position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1, 1, 3, 32, 1, false, 0, Math.PI]} />
          </mesh>
          <mesh material={materials.gold} position={[-1.45, 0.25, 0]}>
            <boxGeometry args={[0.15, 0.55, 2.05]} />
          </mesh>
          <mesh material={materials.gold} position={[1.45, 0.25, 0]}>
            <boxGeometry args={[0.15, 0.55, 2.05]} />
          </mesh>
          <mesh material={materials.gold} position={[-1.45, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.05, 1.05, 0.15, 32, 1, false, 0, Math.PI]} />
          </mesh>
          <mesh material={materials.gold} position={[1.45, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.05, 1.05, 0.15, 32, 1, false, 0, Math.PI]} />
          </mesh>
          <mesh material={materials.gold} position={[0, 0.1, 1.05]}>
            <boxGeometry args={[0.3, 0.6, 0.15]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
