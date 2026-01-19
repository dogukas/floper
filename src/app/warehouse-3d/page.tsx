"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    Text,
    Environment,
    ContactShadows,
    Float,
    useCursor,
    PointerLockControls,
    KeyboardControls,
    PerspectiveCamera
} from "@react-three/drei";
import { useStockStore } from "@/store/useStockStore";
import { useLayoutEffect, useRef, useState, useMemo, useEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
    X,
    Search,
    Thermometer,
    Target,
    MousePointer2,
    Box as BoxIcon
} from "lucide-react";

// Types
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
    useCursor(hovered);

    // Staggered entrance animation
    useLayoutEffect(() => {
        if (meshRef.current) {
            meshRef.current.scale.set(0, 0, 0);
            gsap.to(meshRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: index * 0.05 + Math.random() * 0.5
            });
        }
    }, [index]);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Hover animation or Spotlight pulse
        if (hovered || (isHighlighted && opacity === 1)) {
            meshRef.current.rotation.y += 0.02;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        } else {
            // Return to original pos smoothly
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
                // "Drone pick" animation effect
                if (meshRef.current) {
                    gsap.to(meshRef.current.position, { y: position[1] + 2, duration: 0.5, yoyo: true, repeat: 1 });
                }
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial
                color={hovered ? "#ffffff" : color}
                roughness={0.2}
                metalness={0.1}
                emissive={isHighlighted ? color : "#000000"}
                emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.5 : 0)}
                transparent
                opacity={opacity}
            />
        </mesh>
    );
};

const Shelf = ({ position, items, brandName, onClickItem, heatmapMode, searchQuery }: {
    position: [number, number, number],
    items: any[],
    brandName: string,
    onClickItem: (item: any) => void,
    heatmapMode: boolean,
    searchQuery: string
}) => {
    const itemsPerRow = 5;

    return (
        <group position={position}>
            {/* Shelf Structure */}
            <mesh position={[0, -0.5, 0]} receiveShadow>
                <boxGeometry args={[5, 0.2, 2]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>

            <mesh position={[0, 2, -1]} receiveShadow>
                <boxGeometry args={[5, 5, 0.1]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>

            {/* Brand Label */}
            <Text
                position={[0, 4.8, -1]}
                rotation={[0, 0, 0]}
                fontSize={0.6}
                color="white"
                anchorX="center"
                maxWidth={4}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
                {brandName}
            </Text>

            {/* Floor Marking */}
            <group position={[0, -0.59, 2]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[5, 0.2]} />
                    <meshBasicMaterial color="#fbbf24" />
                </mesh>
                <Text
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0.01, 0.4]}
                    fontSize={0.3}
                    color="#94a3b8"
                >
                    ZONE {brandName.substring(0, 3).toUpperCase()}
                </Text>
            </group>

            {/* Product Boxes */}
            {items.map((item, i) => {
                if (i > 9) return null; // Limit items for demo performance

                const row = Math.floor(i / itemsPerRow);
                const col = i % itemsPerRow;

                // Color Logic
                let color = "#ffffff";
                if (heatmapMode) {
                    const count = parseInt(item.Envanter) || 0;
                    if (count <= 0) color = "#3b82f6"; // Blue = Dead/Zero
                    else if (count < 10) color = "#ef4444"; // Red = Low
                    else if (count < 50) color = "#eab308"; // Yellow = Medium
                    else color = "#22c55e"; // Green = High
                } else {
                    const colorString = typeof item["Renk Kodu"] === 'string' ? item["Renk Kodu"] : 'Unknown';
                    const colorHash = colorString.split('').reduce((acc: number, char: string, i: number) => acc + char.charCodeAt(0) * (i + 1), 0);
                    const hue = colorHash % 360;
                    color = `hsl(${hue}, 70%, 50%)`;
                }

                // Spotlight Logic
                let isHighlighted = true;
                let opacity = 1;

                if (searchQuery && searchQuery.length > 1) {
                    const query = searchQuery.toLowerCase();
                    const match =
                        item.Marka.toLowerCase().includes(query) ||
                        item["Ürün Grubu"].toLowerCase().includes(query) ||
                        item["Ürün Kodu"].toLowerCase().includes(query);

                    if (match) {
                        isHighlighted = true;
                        opacity = 1;
                    } else {
                        isHighlighted = false;
                        opacity = 0.1;
                    }
                }

                return (
                    <ProductBox
                        key={i}
                        index={i}
                        position={[
                            (col * 0.9) - 1.8,
                            0.4 + (row * 0.9),
                            (row > 1 ? -0.5 : 0.5)
                        ]}
                        color={color}
                        item={item}
                        onClick={onClickItem}
                        isHighlighted={isHighlighted}
                        opacity={opacity}
                    />
                );
            })}
        </group>
    );
};

const WarehouseScene = ({
    onSelectItem,
    heatmapMode,
    searchQuery
}: {
    onSelectItem: (item: any) => void,
    heatmapMode: boolean,
    searchQuery: string
}) => {
    const stockData = useStockStore((state) => state.stockData);

    // Safety check for stockData
    const safeStockData = useMemo(() => Array.isArray(stockData) ? stockData : [], [stockData]);

    const { brandGroups } = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        safeStockData.forEach(item => {
            if (!item || !item.Marka) return;
            if (!grouped[item.Marka]) grouped[item.Marka] = [];
            grouped[item.Marka].push(item);
        });

        // Convert to array and sort
        const groups = Object.entries(grouped)
            .map(([brand, items]) => ({ brand, items }))
            .sort((a, b) => b.items.length - a.items.length)
            .slice(0, 16);

        return { brandGroups: groups };
    }, [safeStockData]);

    const groupRef = useRef<THREE.Group>(null);

    // Entrance
    useLayoutEffect(() => {
        if (groupRef.current) {
            gsap.from(groupRef.current.rotation, {
                y: Math.PI,
                duration: 2,
                ease: "power3.out"
            });
        }
    }, []);

    return (
        <group ref={groupRef}>
            {brandGroups.map((group, i) => {
                const shelvesPerRow = 4;
                const row = Math.floor(i / shelvesPerRow);
                const col = i % shelvesPerRow;

                return (
                    <Shelf
                        key={group.brand}
                        brandName={group.brand}
                        items={group.items}
                        position={[
                            (col - 1.5) * 8, // Wider spacing
                            0,
                            (row - 1.5) * 8
                        ]}
                        onClickItem={onSelectItem}
                        heatmapMode={heatmapMode}
                        searchQuery={searchQuery}
                    />
                );
            })}

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
                <gridHelper args={[100, 50, 0x1e293b, 0x1e293b]} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
            </mesh>

            {/* Ambient particles */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 8, -15]}>
                    <torusKnotGeometry args={[1, 0.3, 100, 16]} />
                    <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>
        </group>
    );
};

// Player Controller for FPS Mode
const PlayerController = () => {
    const { camera } = useThree();
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': setMoveForward(true); break;
                case 'ArrowLeft':
                case 'KeyA': setMoveLeft(true); break;
                case 'ArrowDown':
                case 'KeyS': setMoveBackward(true); break;
                case 'ArrowRight':
                case 'KeyD': setMoveRight(true); break;
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': setMoveForward(false); break;
                case 'ArrowLeft':
                case 'KeyA': setMoveLeft(false); break;
                case 'ArrowDown':
                case 'KeyS': setMoveBackward(false); break;
                case 'ArrowRight':
                case 'KeyD': setMoveRight(false); break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        const speed = 10 * delta;
        if (moveForward) camera.translateZ(-speed);
        if (moveBackward) camera.translateZ(speed);
        if (moveLeft) camera.translateX(-speed);
        if (moveRight) camera.translateX(speed);
        // Keep height constant for "walking"
        camera.position.y = 2;
    });

    return null;
}

export default function Warehouse3DPage() {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [heatmapMode, setHeatmapMode] = useState(false);
    const [fpsMode, setFpsMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // We use the global store's search query usually, but for this specific 3D view 
    // it's better to have visual feedback search right on the canvas overlay.

    return (
        <div className="w-full h-screen bg-slate-950 relative overflow-hidden font-sans">

            {/* HUD / Controls Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-start">
                <div className="pointer-events-auto space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            3D WAREHOUSE
                        </h1>
                        <p className="text-slate-400 text-sm tracking-widest uppercase">Digital Twin Simulation</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded-lg w-80">
                        <Search className="text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Spotlight Search (Brand, SKU...)"
                            className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => { if (fpsMode) setFpsMode(false); }} // Exit FPS to type
                        />
                    </div>
                </div>

                <div className="pointer-events-auto flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg min-w-[200px]">
                        <div className="flex items-center gap-2">
                            <Thermometer size={18} className={heatmapMode ? "text-orange-500" : "text-slate-400"} />
                            <span className="text-sm font-medium text-slate-200">Heatmap</span>
                        </div>
                        <Switch checked={heatmapMode} onCheckedChange={setHeatmapMode} />
                    </div>

                    <div className="flex items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg min-w-[200px]">
                        <div className="flex items-center gap-2">
                            <Target size={18} className={fpsMode ? "text-green-500" : "text-slate-400"} />
                            <span className="text-sm font-medium text-slate-200">FPS Mode</span>
                        </div>
                        <Switch checked={fpsMode} onCheckedChange={setFpsMode} />
                    </div>
                    {fpsMode && (
                        <div className="text-xs text-slate-400 text-right bg-black/50 p-2 rounded">
                            Use <b>WASD</b> to move<br /><b>Click</b> to lock view<br /><b>ESC</b> to unlock
                        </div>
                    )}
                </div>
            </div>

            {/* Legend for Heatmap */}
            {heatmapMode && (
                <div className="absolute bottom-6 left-6 z-20 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-lg space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Inventory Levels</p>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-slate-300">Dead Stock (0)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs text-slate-300">Critical (&lt;10)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-xs text-slate-300">Medium (&lt;50)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs text-slate-300">Healthy (&gt;50)</span></div>
                </div>
            )}

            {/* Info Panel Overlay */}
            {selectedItem && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-80">
                    <Card className="bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden p-0 animate-in fade-in zoom-in duration-300">
                        <div className="h-2 w-full bg-indigo-500" />
                        <div className="p-6 relative">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedItem.Marka}</h3>
                            <p className="text-sm text-slate-500 mb-4">{selectedItem["Ürün Grubu"]}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span className="text-sm text-slate-600">Ürün Kodu</span>
                                    <span className="font-mono text-sm font-medium">{selectedItem["Ürün Kodu"]}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span className="text-sm text-slate-600">Renk</span>
                                    <span className="font-medium text-sm">{selectedItem["Renk Kodu"]}</span>
                                </div>
                                <div className="flex justify-between items-center bg-indigo-50 p-2 rounded">
                                    <span className="text-sm text-indigo-700 font-medium">Stok Adedi</span>
                                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        {selectedItem.Envanter || 0}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Canvas */}
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 15, 25], fov: 50 }}>
                <fog attach="fog" args={['#0f172a', 10, 60]} />
                <Environment preset="city" />
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                />

                <WarehouseScene
                    onSelectItem={setSelectedItem}
                    heatmapMode={heatmapMode}
                    searchQuery={searchQuery}
                />

                <ContactShadows resolution={1024} scale={100} blur={2} opacity={0.5} far={10} color="#000000" />

                {fpsMode ? (
                    <>
                        <PointerLockControls selector="#fps-lock" />
                        <PlayerController />
                    </>
                ) : (
                    <OrbitControls
                        maxPolarAngle={Math.PI / 2 - 0.05}
                        minDistance={5}
                        maxDistance={50}
                        enablePan={true}
                        autoRotate={!selectedItem && !searchQuery}
                        autoRotateSpeed={0.5}
                    />
                )}
            </Canvas>

            {/* FPS Lock Trigger (Invisible) */}
            {fpsMode && (
                <div id="fps-lock" className="absolute inset-0 z-10 cursor-crosshair" />
            )}
        </div>
    );
}
