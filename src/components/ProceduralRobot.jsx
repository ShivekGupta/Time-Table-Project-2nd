import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export default function ProceduralRobot({ isChatOpen, messageCount, position = [3, 0.5, -2] }) {
  const group = useRef();
  const prevMsgCount = useRef(messageCount);
  
  // Idle bobbing animation + chat open focus
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      // Idle bob
      group.current.position.y = position[1] + Math.sin(t * 2) * 0.1;
      
      // If chat is open, robot floats slightly higher and looks more towards the camera
      if (isChatOpen) {
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, position[2] + 1, 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.5, 0.05);
      } else {
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, position[2], 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.05);
      }
    }
  });

  // Reaction animation on new message
  useEffect(() => {
    if (messageCount > prevMsgCount.current && group.current) {
      // Jump and spin!
      gsap.killTweensOf(group.current.rotation);
      
      gsap.to(group.current.rotation, {
        y: group.current.rotation.y + Math.PI * 2,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      prevMsgCount.current = messageCount;
    }
  }, [messageCount]);

  // Materials
  const materials = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.6, roughness: 0.3 }),
    joint: new THREE.MeshStandardMaterial({ color: '#451a03', metalness: 0.9, roughness: 0.5 }),
    eye: new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#38bdf8', emissiveIntensity: 2 })
  }), []);

  return (
    <group ref={group} position={position} dispose={null} scale={0.4}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]} material={materials.body}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.2, 2.3, 0.51]} material={materials.eye}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh position={[0.2, 2.3, 0.51]} material={materials.eye}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.6, 0]} material={materials.joint}>
        <cylinderGeometry args={[0.2, 0.2, 0.4]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.7, 0]} material={materials.body}>
        <boxGeometry args={[1.4, 1.6, 0.8]} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.85, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.joint}>
        <cylinderGeometry args={[0.25, 0.25, 0.5]} />
      </mesh>
      <mesh position={[0.85, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.joint}>
        <cylinderGeometry args={[0.25, 0.25, 0.5]} />
      </mesh>

      {/* Arms */}
      <mesh position={[-1.1, 0.5, 0]} material={materials.body}>
        <cylinderGeometry args={[0.2, 0.15, 1.2]} />
      </mesh>
      <mesh position={[1.1, 0.5, 0]} material={materials.body}>
        <cylinderGeometry args={[0.2, 0.15, 1.2]} />
      </mesh>

      {/* Hands */}
      <mesh position={[-1.1, -0.2, 0]} material={materials.joint}>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
      <mesh position={[1.1, -0.2, 0]} material={materials.joint}>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
      
      {/* Floating base instead of legs for a mystical look */}
      <mesh position={[0, -0.6, 0]} material={materials.joint}>
        <cylinderGeometry args={[0.6, 0, 0.8, 16]} />
      </mesh>
    </group>
  );
}
