import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { contactShadows, Float, PerspectiveCamera, useCursor } from '@react-three/drei/native';
import { Ionicons } from '@expo/vector-icons';
import gsap from 'gsap';
import * as THREE from 'three';
import { useStockStore } from '../store/useStockStore';

// --- 3D Components ---

interface BoxProps {
    position: [number, number, number];
    color: string;
    item: any;
    onClick: (item: any) => void;
    index: number;
    isHighlighted: boolean;
    opacity: number;
}

const ProductBox = ({ position, color, item, onClick, index, isHighlighted, opacity }: BoxProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    // Entrance animation
    useLayoutEffect(() => {
        if (meshRef.current) {
            meshRef.current.scale.set(0, 0, 0);
            gsap.to(meshRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: index * 0.05
            });
        }
    }, [index]);

    useFrame((state) => {
        if (!meshRef.current) return;

        if (hovered || (isHighlighted && opacity === 1)) {
            meshRef.current.rotation.y += 0.02;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        } else {
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onClick(item);
                if (meshRef.current) {
                    gsap.to(meshRef.current.position, { y: position[1] + 2, duration: 0.5, yoyo: true, repeat: 1 });
                }
            }}
        // On mobile pointer events might need adjustment, but onClick works for tap
        >
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial
                color={hovered ? "#ffffff" : color}
                roughness={0.2}
                metalness={0.1}
                emissive={isHighlighted ? new THREE.Color(color) : new THREE.Color("#000000")}
                emissiveIntensity={isHighlighted ? 0.8 : 0}
            />
        </mesh>
    );
};

const Shelf = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* Vertical Supports */}
            <mesh position={[-2.1, 2.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 5, 1]} />
                <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>
            <mesh position={[2.1, 2.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 5, 1]} />
                <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>

            {/* Horizontal Beams/Shelves */}
            {[-1.5, 0, 1.5, 3, 4.5].map((y, i) => (
                <mesh key={i} position={[0, y, 0]} receiveShadow>
                    <boxGeometry args={[4.4, 0.1, 1]} />
                    <meshStandardMaterial color="#64748b" roughness={0.5} />
                </mesh>
            ))}
        </group>
    );
};

// --- Main Screen ---

export default function Warehouse3DScreen() {
    const { stocks, fetchStocks } = useStockStore();
    const [selectedItem, setSelectedItem] = useState<any>(null);

    useEffect(() => {
        fetchStocks();
    }, []);

    // Generate 3D grid layout
    const shelves = [];
    const items = [];

    // Create 3 aisles of shelves
    for (let aisle = 0; aisle < 3; aisle++) {
        for (let section = 0; section < 4; section++) {
            shelves.push({
                position: [(aisle - 1) * 8, 0, (section - 1.5) * 6] as [number, number, number],
                id: `shelf-${aisle}-${section}`
            });
        }
    }

    // Populate items
    stocks.slice(0, 50).forEach((stock, i) => {
        const shelfIndex = i % shelves.length;
        const shelf = shelves[shelfIndex];
        const level = Math.floor(i / shelves.length) % 4; // 4 levels
        const side = i % 2 === 0 ? -1 : 1; // 2 items per level roughly

        items.push({
            ...stock,
            position: [
                shelf.position[0] + side,
                shelf.position[1] + (level * 1.5) + 0.5, // Height logic
                shelf.position[2]
            ] as [number, number, number],
            color: stock.Marka === 'Nike' ? '#ef4444' : stock.Marka === 'Adidas' ? '#3b82f6' : '#22c55e'
        });
    });

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <Stack.Screen options={{ title: '3D Depo', headerShown: false }} />

            {/* 3D Canvas */}
            <View className="flex-1">
                <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} color="blue" />

                    <PerspectiveCamera makeDefault position={[12, 10, 12]} />
                    {/* Controls - OrbitControls from drei/native might not be fully standard, let's try standard imports or useGesture if needed. 
                  Actually @react-three/drei/native has OrbitControls
              */}
                    {/* Note: OrbitControls in native might require gesture handling, often works out of box with touch */}

                    <group position={[0, -2, 0]}>
                        {shelves.map(shelf => (
                            <Shelf key={shelf.id} position={shelf.position} />
                        ))}

                        {items.map((item, index) => (
                            <ProductBox
                                key={item.id || index}
                                index={index}
                                position={item.position}
                                color={item.color}
                                item={item}
                                onClick={setSelectedItem}
                                isHighlighted={selectedItem?.id === item.id}
                                opacity={1}
                            />
                        ))}

                        {/* Floor */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                            <planeGeometry args={[50, 50]} />
                            <meshStandardMaterial color="#1e293b" opacity={0.8} transparent />
                        </mesh>
                    </group>
                </Canvas>
            </View>

            {/* UI Overlay */}
            <View className="absolute top-12 left-4 right-4 flex-row justify-between items-start pointer-events-none">
                <TouchableOpacity
                    onPress={() => setSelectedItem(null)} // Or navigation.back
                    className="bg-slate-800/80 p-3 rounded-full"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className="bg-slate-800/80 px-4 py-2 rounded-full">
                    <Text className="text-white font-bold">FPS: 60</Text>
                </View>
            </View>

            {/* Item Detail Overlay */}
            {selectedItem && (
                <View className="absolute bottom-10 left-4 right-4 bg-slate-800/90 p-6 rounded-2xl border border-slate-700 shadow-xl">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-2xl font-bold text-white">{selectedItem.Marka}</Text>
                            <Text className="text-slate-400">{selectedItem["Ürün Kodu"]}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setSelectedItem(null)}>
                            <Ionicons name="close-circle" size={30} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row mt-4 gap-4">
                        <View className="bg-indigo-500/20 px-4 py-2 rounded-xl">
                            <Text className="text-indigo-400 font-bold text-xl">{selectedItem.Envanter}</Text>
                            <Text className="text-indigo-300 text-xs">Stok</Text>
                        </View>
                        <View className="bg-green-500/20 px-4 py-2 rounded-xl">
                            <Text className="text-green-400 font-bold text-xl">A1-03</Text>
                            <Text className="text-green-300 text-xs">Konum</Text>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
