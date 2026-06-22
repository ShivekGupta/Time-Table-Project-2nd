import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleBurst({ count = 100, trigger }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // State array to hold our physics data
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        rotationSpeed: new THREE.Vector3(0, 0, 0),
        scale: 0,
        life: 0 // 0 means dead
      })
    }
    return temp
  }, [count])

  // Fire particles when 'trigger' changes
  useEffect(() => {
    if (!trigger) return;
    
    // Reset all particles
    particles.forEach((particle) => {
      particle.position.set(2, -1, 0) // Start at Logbook position
      particle.velocity.set(
        (Math.random() - 0.5) * 8, // X spread
        Math.random() * 8 + 4,     // Y upwards burst
        (Math.random() - 0.5) * 8  // Z spread
      )
      particle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      particle.rotationSpeed.set(Math.random() * 0.4 - 0.2, Math.random() * 0.4 - 0.2, Math.random() * 0.4 - 0.2)
      particle.scale = Math.random() * 0.2 + 0.1
      particle.life = 1.0 // Fully alive
    })
  }, [trigger, particles])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    let needsUpdate = false;
    particles.forEach((particle, i) => {
      if (particle.life > 0) {
        needsUpdate = true;
        // Gravity
        particle.velocity.y -= 15.0 * delta

        // Position
        particle.position.addScaledVector(particle.velocity, delta)

        // Rotation
        particle.rotation.add(particle.rotationSpeed)

        // Life decrease
        particle.life -= delta * 0.6

        // Apply
        dummy.position.copy(particle.position)
        dummy.rotation.setFromVector3(particle.rotation)
        
        // Scale shrinks as it dies
        const currentScale = Math.max(0, particle.scale * particle.life)
        dummy.scale.set(currentScale, currentScale, currentScale)
        
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      } else if (particle.life > -1) {
        // Just died, move out of view once
        particle.life = -2;
        dummy.position.set(0, -1000, 0)
        dummy.scale.set(0,0,0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        needsUpdate = true;
      }
    })

    if (needsUpdate) {
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* Coin geometry */}
      <cylinderGeometry args={[1, 1, 0.2, 16]} />
      <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
    </instancedMesh>
  )
}
