import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CustomWaterMaterial } from './CustomWaterShader.js'
import ParticleBurst from './ParticleBurst.jsx'
import AvatarModel from './AvatarModel.jsx'
import OracleTutorModel from './OracleTutorModel.jsx'
import ProceduralRobot from './ProceduralRobot.jsx'
import ParrotModel from './ParrotModel.jsx'
import TreasureChest from './TreasureChest.jsx'
import gsap from 'gsap'

function SceneContent({ activeTab, avatar, burstTrigger, isChatOpen, messageCount, onFindTreasure }) {
  const waterRef = useRef()
  const logbookRef = useRef()
  const compassRef = useRef()
  const parrotRef = useRef()
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    // Update Shader Time for the water caustics
    if (waterRef.current) {
      waterRef.current.material.uniforms.uTime.value += delta
    }
    
    // Animate props
    if (logbookRef.current) {
      logbookRef.current.rotation.y += delta * 0.2
      logbookRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 1
    }

    if (compassRef.current) {
      compassRef.current.rotation.z -= delta * 0.5
    }

    // Smooth camera damping logic via GSAP (manually lerping position)
    state.camera.position.lerp(cameraTarget.current, 0.05)
    state.camera.lookAt(0, 0, 0)
    
    // Parrot cursor follow logic
    if (parrotRef.current) {
      // Map mouse coordinates (-1 to 1) to 3D space
      const targetX = (state.mouse.x * state.viewport.width) / 2;
      const targetY = (state.mouse.y * state.viewport.height) / 2;
      
      // Lerp parrot position towards mouse
      parrotRef.current.position.x = THREE.MathUtils.lerp(parrotRef.current.position.x, targetX, 0.05);
      parrotRef.current.position.y = THREE.MathUtils.lerp(parrotRef.current.position.y, targetY, 0.05);
      
      // Orient parrot to direction of movement
      const dx = targetX - parrotRef.current.position.x;
      const dy = targetY - parrotRef.current.position.y;
      parrotRef.current.rotation.y = THREE.MathUtils.lerp(parrotRef.current.rotation.y, dx * 2, 0.1);
      parrotRef.current.rotation.z = THREE.MathUtils.lerp(parrotRef.current.rotation.z, -dx * 0.5, 0.1);
      parrotRef.current.rotation.x = THREE.MathUtils.lerp(parrotRef.current.rotation.x, -dy * 0.5, 0.1);
      
      // Barrel roll when chat is open
      if (isChatOpen) {
         parrotRef.current.rotation.x += delta * 5;
      }
    }
  })

  // GSAP Cinematic Transitions based on Active Tab
  useEffect(() => {
    const tl = gsap.timeline()
    
    if (activeTab === 'map') {
      // Pull back to see the whole ocean
      tl.to(cameraTarget.current, { x: 0, y: 0, z: 8, duration: 1.5, ease: "power3.inOut" })
    } else if (activeTab === 'dashboard') {
      // Zoom into the Logbook
      tl.to(cameraTarget.current, { x: 2, y: -0.5, z: 3, duration: 1.5, ease: "power3.inOut" })
    } else if (activeTab === 'timetable') {
      // Zoom into the Compass
      tl.to(cameraTarget.current, { x: -2, y: 1, z: 4, duration: 1.5, ease: "power3.inOut" })
    } else {
      // Default intermediate view
      tl.to(cameraTarget.current, { x: 0, y: -1, z: 5, duration: 1.5, ease: "power3.inOut" })
    }
  }, [activeTab])

  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Candle Light */}
      <pointLight position={[2, 2, 2]} intensity={2} color="#ffb74d" distance={10} decay={2} />
      <pointLight position={[-2, -2, 2]} intensity={1.5} color="#4fc3f7" distance={10} decay={2} />
      
      {/* Background Volumetric Water Plane */}
      <mesh ref={waterRef} position={[0, 0, -8]}>
        <planeGeometry args={[30, 30, 64, 64]} />
        <primitive object={CustomWaterMaterial} attach="material" />
      </mesh>
      
      {/* 3D Logbook Object */}
      <mesh ref={logbookRef} position={[2, -1, 0]} rotation={[-0.3, -0.4, 0]}>
        <boxGeometry args={[1.8, 0.15, 2.4]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* 3D Compass Object */}
      <mesh ref={compassRef} position={[-2, 1, 0]} rotation={[0.2, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Gamification Items */}
      <AvatarModel avatar={avatar} />
      <ParticleBurst count={50} trigger={burstTrigger} />

      {/* AI Oracle Tutor */}
      <ProceduralRobot isChatOpen={isChatOpen} messageCount={messageCount} position={[3, 0.5, -2]} />

      {/* Interactive Treasure Chest Minigame */}
      <TreasureChest position={[-3, -0.5, -3]} onFindTreasure={onFindTreasure} />

      {/* 3D Pirate Parrot AI Assistant */}
      <group ref={parrotRef} position={[0, 0, 2]}>
        <ParrotModel isFlying={true} />
      </group>
    </>
  )
}

export default function GlobalCanvas({ activeTab, avatar, burstTrigger, isChatOpen, messageCount, onFindTreasure }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <ambientLight intensity={0.5} />
        <SceneContent activeTab={activeTab} avatar={avatar} burstTrigger={burstTrigger} isChatOpen={isChatOpen} messageCount={messageCount} onFindTreasure={onFindTreasure} />
      </Canvas>
    </div>
  )
}
