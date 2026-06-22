import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export default function OracleTutorModel({ isChatOpen, messageCount }) {
  const groupRef = useRef()
  const prevMessageCount = useRef(messageCount)

  // Floating animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + (isChatOpen ? 1 : 4) // adjust base Y based on chat open/closed to be safe, but gsap handles the main position
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.2 - 0.5 // slight rotation
    }
  })

  // Animate in/out when chat toggles
  useEffect(() => {
    if (!groupRef.current) return

    if (isChatOpen) {
      // Animate into view (e.g. from top right)
      gsap.to(groupRef.current.position, {
        x: 3.5, // keep it on the right but not blocking chat
        y: 1, // visible in camera
        z: 2, // closer to camera
        duration: 1,
        ease: "back.out(1.5)"
      })
      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: "power2.out"
      })
    } else {
      // Animate out of view (e.g. fly up/away)
      gsap.to(groupRef.current.position, {
        x: 5,
        y: 5,
        z: 0,
        duration: 1,
        ease: "power2.in"
      })
      gsap.to(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        delay: 0.5,
        ease: "power2.in"
      })
    }
  }, [isChatOpen])

  // Animate on new message
  useEffect(() => {
    if (!groupRef.current) return
    
    if (messageCount > prevMessageCount.current) {
      // Bounce / Nod effect
      const tl = gsap.timeline()
      tl.to(groupRef.current.rotation, {
        x: 0.3,
        duration: 0.15,
        ease: "power1.inOut"
      })
      .to(groupRef.current.rotation, {
        x: -0.1,
        duration: 0.15,
        ease: "power1.inOut"
      })
      .to(groupRef.current.rotation, {
        x: 0,
        duration: 0.15,
        ease: "power1.inOut"
      })
    }
    prevMessageCount.current = messageCount
  }, [messageCount])

  return (
    <group ref={groupRef} position={[5, 5, 0]} scale={[0, 0, 0]}>
      {/* Procedural Parrot / Oracle Tutor */}
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0.1]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.5, 0.4]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#d97706" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.6, 0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 0.6, 0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Wing Left */}
      <mesh position={[-0.35, 0, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.4]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.5} />
      </mesh>
      {/* Wing Right */}
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.4]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.5} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, -0.4, -0.2]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#d97706" roughness={0.5} />
      </mesh>
      {/* Little floating magic ring or something to make it "Oracle" */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.02, 16, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
