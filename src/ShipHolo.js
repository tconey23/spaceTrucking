import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Sphere, PerspectiveCamera, OrthographicCamera} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';

function Model({ url, position, cameraPosition, zoom, color = 'orange', materialProps = {} }) {
    const { camera } = useThree()
    const { scene, materials, nodes } = useGLTF(url);
    const holoRef = useRef()
    useEffect(() => {
        if (cameraPosition || camera.zoom) {
            camera.position.set(...cameraPosition);
            camera.zoom = (zoom)
        }
              
        camera.updateProjectionMatrix();

        // console.log("Camera position:", camera.position, "Camera zoom:", camera.zoom)
        return () => {
        };
    }, [cameraPosition, camera, scene, materials, nodes]);
    useEffect(() => {
        return () => {
            Object.values(nodes).forEach((node) => {
                if (node.geometry) node.geometry.dispose();
            });

            Object.values(materials).forEach((material) => {
                if (material.map) material.map.dispose();
                if (material.lightMap) material.lightMap.dispose();
                if (material.aoMap) material.aoMap.dispose();
                if (material.emissiveMap) material.emissiveMap.dispose();
                if (material.bumpMap) material.bumpMap.dispose();
                if (material.normalMap) material.normalMap.dispose();
                if (material.displacementMap) material.displacementMap.dispose();
                if (material.roughnessMap) material.roughnessMap.dispose();
                if (material.metalnessMap) material.metalnessMap.dispose();
                if (material.alphaMap) material.alphaMap.dispose();
                if (material.envMap) material.envMap.dispose();
                material.dispose();
            });

            scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();

                    if (child.material.isMaterial) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                }
            });
        };
    }, [scene, materials, nodes]);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
                Object.assign(child.material, materialProps);
                child.material.needsUpdate = true;
            }
        });
    }, [scene, color, materialProps]);

    useFrame(() => {
        if (holoRef.current) {
            // Incrementally update the rotation on each frame
            holoRef.current.rotation.y -= 0.005; 
            // holoRef.current.rotation.x += 0.005; 
            // holoRef.current.rotation.z += 0.003; 
        }
    });

    return <primitive ref={holoRef} object={scene} position={position} />;
}

const ShipHolo = ({ shipUrl }) => {
    const [holoUrl, setHoloUrl] = useState(null);
    const controlsRef = useRef();
    
    useEffect(() => {
        if (shipUrl) {
            const fetchGltf = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/fetch-gltf?url=${encodeURIComponent(shipUrl)}`);
                    if (response.ok) {
                        const filename = new URL(shipUrl).pathname.split('/').pop();
                        setHoloUrl(`http://localhost:5000/downloads/${filename}`);
                    } else {
                        console.error('Failed to fetch GLTF:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching GLTF:', error);
                }
            };

            fetchGltf();
        }
    }, [shipUrl]);



    return (
        <div className='canvas-test-wrapper'>
            <Canvas style={{ width: '50%', height: '50%', background: 'black' }} >
                <ambientLight intensity={1} color={'blue'}/>
                <directionalLight intensity={50} position={[10, 10, 10]} color={'blue'}/>
                {holoUrl && (
                    <Suspense fallback={<Html>Loading...</Html>}>
                        <mesh >
                            <Model  zoom={5.403600876626375} cameraPosition={[-217.72807196061004, 109.15011821192999, 195.9202756077539]} position={[0,0,0]} url={holoUrl} color={'blue'}/>
                            <meshLambertMaterial color={'blue'}/>
                        </mesh>
                    </Suspense>
                )}
                <OrthographicCamera/>
                <OrbitControls 
                ref={controlsRef}
                onChange={(e) => {

                  const camera = e.target.object;
                //   console.log('Camera position:', [...camera.position])
                //   console.log('Camera zoom:', camera.zoom);
                }}
                />
            </Canvas>
        </div>
    );
}

export default ShipHolo;
