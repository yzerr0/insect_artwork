"use client"

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import React, { Suspense, useRef, } from "react";
import { gsap } from "gsap";

export default function Home() {
    return (
        <div className="w-screen h-screen bg-orange-950">
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
                <meshStandardMaterial color={i === 12 ? '#956f64' : color} />
            </mesh>
        );
    }
    
    function handleClick() {
        // random rotation on all axes (radians)
        gsap.to(groupRef.current.rotation, {
            x: `+=${gsap.utils.random(0,0.75)}`,
            y: `+=${gsap.utils.random(0,0.75)}`,
            duration: 1.3,
            ease: "elastic.out(1, 0.3)",
            // yoyo: true,
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