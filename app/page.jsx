"use client"

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, Environment } from '@react-three/drei';
import React, { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Home() {
    return (
        <div className="w-screen h-screen">
            <Canvas shadows camera={{ position: [-6, 7, 7] }}
            gl={{antialias:false}}>
                <Suspense fallback={null}>
                    <Geometries />
                    <ContactShadows position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]} opacity={0.65} width={10} height={10} blur={1} far={10} />
                    <Environment preset="forest" />
                </Suspense>
            </Canvas>
        </div>
    );
}

function Geometries() {
    const geometries = [
        {
            position: [0, 0, 0],
            r: 0.3,
            geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16),
        }
    ]
    
    const materials =  [ 
        new THREE.MeshStandardMaterial({ color: "green" }),
        new THREE.MeshStandardMaterial({ color: "blue" }),
    ]

    return geometries.map(({position, geometry, r}) => {
        return (
            <Geometry 
            key={JSON.stringify(position)} 
            position={position.map(p=>p*2)} 
            geometry={geometry}
            materials={materials} 
            r={r}
            />
        )
    });
}

function Geometry({geometry, materials, position, r}) {
    const meshRef = useRef();
    const [visible, setVisible] = useState(false);

    const startMaterial = getRandomMaterial();

        function getRandomMaterial() {
            // return materials[Math.floor(Math.random() * materials.length)];
            return gsap.utils.random(materials);
        }
        function handleClick(e) {
            const mesh = e.object;

            // random rotation on all axes (radians)
            gsap.to(mesh.rotation, {
                x: `+=${gsap.utils.random(0,2)}`,
                // y: `+=${gsap.utils.random(0,2)}`,
                z: `+=${gsap.utils.random(0,2)}`,
                duration: 1.3,
                ease: "elastic.out(1, 0.3)",
                // yoyo: true,
            });

            mesh.material = getRandomMaterial();
        }

        const handleHover = () => {
            document.body.style.cursor = "pointer";
        }

        const handleUnhover = () => {
            document.body.style.cursor = "default";
        }

        useEffect(() => {
            let ctx = gsap.context(() => {
                setVisible(true);
                gsap.from(meshRef.current.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.3,
                    ease: "elastic.out(1, 0.3)",
                    delay: 0.3,
                });
            });
            return () => ctx.revert(); // cleanup
        }, []);

        return (
            <group position={position} ref={meshRef}>
                <Float speed={5*r} rotationIntensity={6*r} floatIntensity={5*r}>
                    <mesh
                        onClick={handleClick}
                        onPointerOver={handleHover}
                        onPointerOut={handleUnhover}
                        geometry={geometry}
                        material={startMaterial}
                        visible={visible}
                    />
                </Float>
            </group>
        )
}