import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';


export default function ParrotModel({ position, rotation, isFlying = true }) {
  const group = useRef();
  const leftWing = useRef();
  const rightWing = useRef();
  const body = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    // Wing flapping animation
    if (isFlying) {
      const time = state.clock.getElapsedTime();
      const flapSpeed = 15;
      const flapAngle = Math.sin(time * flapSpeed) * 0.6;
      
      if (leftWing.current) leftWing.current.rotation.z = flapAngle;
      if (rightWing.current) rightWing.current.rotation.z = -flapAngle;

      // Subtle body bobbing
      body.current.position.y = Math.sin(time * 5) * 0.1;
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <group ref={body}>
        {/* Main Body - Red */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.7} />
        </mesh>
        
        {/* Tail - Blue/Yellow */}
        <mesh position={[0, -0.4, -0.4]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
          <coneGeometry args={[0.2, 0.8, 4]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.7} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.4, 0.2]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.7} />
        </mesh>
        
        {/* Pirate Hat */}
        <group position={[0, 0.65, 0.2]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} />
          </mesh>
        </group>

        {/* Eye Patch (Right Eye) */}
        <mesh position={[0.15, 0.45, 0.4]} rotation={[0, Math.PI/4, Math.PI/6]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
          <meshStandardMaterial color="#000000" roughness={0.9} />
        </mesh>

        {/* Left Eye */}
        <mesh position={[-0.15, 0.45, 0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[-0.15, 0.45, 0.47]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#000000" roughness={0.1} />
        </mesh>

        {/* Beak - Gold/Yellow */}
        <mesh position={[0, 0.3, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.15, 0.4, 16]} />
          <meshStandardMaterial color="#facc15" roughness={0.5} />
        </mesh>

        {/* Left Wing */}
        <group position={[-0.4, 0, 0]} ref={leftWing}>
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <boxGeometry args={[0.6, 0.1, 0.4]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.7} />
          </mesh>
        </group>

        {/* Right Wing */}
        <group position={[0.4, 0, 0]} ref={rightWing}>
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
            <boxGeometry args={[0.6, 0.1, 0.4]} />
            <meshStandardMaterial color="#10b981" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
