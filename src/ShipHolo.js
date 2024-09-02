import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, OrthographicCamera } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model({ url, position, cameraPosition, zoom, color = 'orange', materialProps = {} }) {
    const { camera } = useThree();
    const { scene, materials, nodes } = useGLTF(url);
    const holoRef = useRef();

    useEffect(() => {
        const defaultCameraPosition = [0, 0, 5];
        const defaultZoom = 1;

        camera.position.set(...(cameraPosition || defaultCameraPosition));
        camera.zoom = zoom || defaultZoom;
        camera.updateProjectionMatrix();
    }, [cameraPosition, zoom, camera, scene, materials, nodes]);

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
            holoRef.current.rotation.y -= 0.005; 
        }
    });

    return <primitive ref={holoRef} object={scene} position={position} />;
}

const ShipHolo = ({ shipUrl }) => {
    const [holoUrl, setHoloUrl] = useState(null);
    const controlsRef = useRef();
    const suspenseRef = useRef();
    const isDev = window.location.hostname === 'localhost';
    const [devOrProd, setDevOrProd] = useState(isDev ? 'http://localhost:3001/' : 'https://your-production-url.com/');

    const newMaterial = new THREE.MeshPhysicalMaterial({
        color: '#00a2ff',
    });

    useEffect(() => {
        if (shipUrl) {
            const fetchGltf = async () => {
                try {
                    const response = await fetch(`${devOrProd}fetch-gltf?url=${encodeURIComponent(shipUrl)}`);
                    if (response.ok) {
                        const filename = new URL(shipUrl).pathname.split('/').pop();
                        console.log(filename)
                        setHoloUrl(`${devOrProd}downloads/${filename}`);
                    } else {
                        console.error('Failed to fetch GLTF:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching GLTF:', error);
                }
            };

            fetchGltf();
        }
        console.log(devOrProd)
    }, [shipUrl, devOrProd]);

    const emptyDownloadsFolder = async () => {
        try {
            const response = await fetch(`${devOrProd}empty-downloads`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Downloads folder emptied successfully.');
            } else {
                console.error('Failed to empty downloads folder:', response.statusText);
            }
        } catch (error) {
            console.error('Error emptying downloads folder:', error);
        }
    };

    useEffect(() => {
        return () => {
            emptyDownloadsFolder();
        };
    }, []);

    return (
        <div className='canvas-test-wrapper'>
            <Canvas ref={suspenseRef} style={{ width: '50%', height: '50%', background: 'black' }}>
                <directionalLight intensity={100} position={[10, 10, 10]} color={'#00a2ff'} />
                {holoUrl && (
                    <Suspense fallback={<Html>Loading...</Html>}>
                        <Model
                            zoom={5.403600876626375}
                            cameraPosition={[-217.72807196061004, 109.15011821192999, 195.9202756077539]}
                            position={[0, 0, 0]}
                            url={holoUrl}
                            newMaterial={newMaterial}
                        />
                    </Suspense>
                )}
                <OrthographicCamera />
                <OrbitControls
                    ref={controlsRef}
                    onChange={(e) => {
                        const camera = e.target.object;
                    }}
                />
            </Canvas>
        </div>
    );
};

export default ShipHolo;
