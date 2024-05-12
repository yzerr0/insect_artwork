"use client"

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import React, { Suspense, useRef, } from "react";
import { gsap } from "gsap";

export default function Home() {
    return (
        <div className="w-screen h-screen bg-orange-950">
            <h1 className="text-white">Click the earthworm to make it crawl</h1>
            <h1 className="text-white">Made by Youssef Zerroug</h1>
            <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 20], fov: 50, near: 1, far: 40 }}
            gl={{antialias:false}}>
                <Suspense fallback={null}>
                    <CapsuleStack />
                    <ContactShadows position={[0, -3.5, 0]} scale={50} opacity={0.65} blur={1} far={10} />
                    <Environment preset="forest" />
                </Suspense>
            </Canvas>
        </div>
    );
}
  
function CapsuleStack() {
    const numCapsules = 15; // Number of capsules to stack
    const capsuleLength = 1.2; // Length of each capsule
    const overlap = 0.2; // Overlap between capsules to make them appear connected
    const color = '#864c31'; // Color of the capsules
    const groupRef = useRef();

    // Calculate the total length of all capsules
    const totalLength = numCapsules * (capsuleLength - overlap);

    // Offset to center the capsules
    const centerOffset = totalLength / 2 - (capsuleLength / 2);

    // Generate the capsules
    const capsules = [];
    for (let i = 0; i < numCapsules; i++) {
        const positionX = i * (capsuleLength - overlap) - centerOffset;
        capsules.push(
            <mesh key={i} position={[positionX, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <capsuleGeometry args={[0.4, 0.6, 4, 8, 1]} />
                <meshStandardMaterial color={i === 11 ? '#956f64' : color} />
            </mesh>
        );
    }
    
    function handleClick() {
        // Move the worm back and forth along the x-axis
        gsap.to(groupRef.current.position, {
          x: "+=5", // Move 5 units to the right
          repeat: 1, // Repeat the animation once
          yoyo: true, // Return to the original position after reaching 5 units
          duration: 2,
          ease: "power1.inOut"
        });
    }

    const handleHover = () => {
        document.body.style.cursor = "pointer";
    }

    const handleUnhover = () => {
        document.body.style.cursor = "default";
    }

    return (
        <group ref={groupRef} onClick={handleClick} onPointerOver={handleHover} onPointerOut={handleUnhover}>
            <>
                {capsules}
            </> 
        </group>
    );
}