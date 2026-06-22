import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AvatarModel({ avatar }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.5
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  if (!avatar || avatar === '🧑‍✈️') return null;

  return (
    <group ref={groupRef} position={[2, 0.5, 0]}>
      {avatar === '🦜' && (
        <group>
          {/* Simple Procedural Parrot */}
          <mesh position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
            <meshStandardMaterial color="#e53935" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.9, 0.2]}>
            <coneGeometry args={[0.1, 0.2, 4]} />
            <meshStandardMaterial color="#ffb300" roughness={0.5} />
          </mesh>
        </group>
      )}
      
      {avatar === '🎩' && (
        <group>
          {/* Simple Procedural Captain Hat */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
            <meshStandardMaterial color="#212121" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
            <meshStandardMaterial color="#212121" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.3, 0.31]}>
            <boxGeometry args={[0.2, 0.1, 0.05]} />
            <meshStandardMaterial color="#ffd700" metalness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  )
}
