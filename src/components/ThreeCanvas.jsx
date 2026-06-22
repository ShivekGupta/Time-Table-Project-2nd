import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCanvas = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.z = 500;

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 3. Particles (Stars/Sea-Light) Setup
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spread positions in a massive 3D grid
      positions[i * 3] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000 - 100;

      // Random speed and sin-wave offset for custom drift animation
      speeds[i] = Math.random() * 0.4 + 0.1;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a circular canvas texture for soft, glowing stars
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(0, 242, 254, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 4,
      map: createStarTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);

    // 4. Mouse Move Event Handler (for camera Parallax)
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX - window.innerWidth / 2) * 0.25;
      mouseRef.current.y = (event.clientY - window.innerHeight / 2) * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Resize Event Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Animate particles drift (simulate space/water currents)
      const positionsArray = starParticles.geometry.attributes.position.array;
      const time = Date.now() * 0.0005;

      for (let i = 0; i < particleCount; i++) {
        // Slow vertical drift down
        positionsArray[i * 3 + 1] -= speeds[i];
        // Horizontal sway (wave) using sin/cos functions
        positionsArray[i * 3] += Math.sin(time + offsets[i]) * 0.08;

        // Reset particle to top if it drifts below view
        if (positionsArray[i * 3 + 1] < -600) {
          positionsArray[i * 3 + 1] = 600;
          positionsArray[i * 3] = (Math.random() - 0.5) * 1200;
        }
      }

      starParticles.geometry.attributes.position.needsUpdate = true;

      // Interpolate camera position towards mouse for smooth parallax
      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

export default React.memo(ThreeCanvas);
