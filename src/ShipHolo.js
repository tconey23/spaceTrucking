import React, { useState, Suspense, useEffect, useRef, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, OrthographicCamera } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GlobalContext } from './GlobalContext';

function Model({ url, position, cameraPosition, zoom, color = 'orange', materialProps = {} }) {
    const { camera } = useThree();
    const { scene } = useGLTF(url);
    const holoRef = useRef();

    useEffect(() => {
        const defaultCameraPosition = [0, 0, 5];
        const defaultZoom = 1;

        // Set the camera position and zoom level
        camera.position.set(...(cameraPosition || defaultCameraPosition));
        camera.zoom = zoom || defaultZoom;
        camera.updateProjectionMatrix();
    }, [cameraPosition, zoom, camera]);

   

    useFrame(() => {
        if (holoRef.current) {
            holoRef.current.rotation.y -= 0.005; // Slow rotation of the model
        }
    });
    return <primitive ref={holoRef} object={scene} position={position} />;
}

const ShipHolo = ({ shipUrl }) => {
    const [holoUrl, setHoloUrl] = useState(null);
    const controlsRef = useRef();
    const { devProd } = useContext(GlobalContext);
    const newMaterial = {
        color: '#00a2ff', // Light blue color for the material
    };

    useEffect(() => {
        if (shipUrl) {
            const fetchGltf = async () => {
                try {
                    const response = await fetch(`${devProd}fetch-gltf?url=${encodeURIComponent(shipUrl)}`);
                    if (response.ok) {
                        const filename = new URL(shipUrl).pathname.split('/').pop();
                        setHoloUrl(`${devProd}downloads/${filename}`);
                    } else {
                        console.error('Failed to fetch GLTF:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching GLTF:', error);
                }
            };

            fetchGltf();
        }
    }, [shipUrl, devProd]);

    useEffect(() => {
        // Uncomment this block if you need to clean up downloads folder on unmount
        // return () => {
        //     emptyDownloadsFolder();
        // };
    }, [devProd]);

    return (
        <div className="canvas-test-wrapper">
            <Canvas style={{ width: '50%', height: '50%', background: 'black' }}>
                <directionalLight intensity={1} position={[10, 10, 10]} color={'#00a2ff'} />
                {holoUrl ? (
                    <Suspense fallback={<Html>Loading...</Html>}>
                        <Model
                            zoom={5.4}
                            cameraPosition={[-217.7, 109.15, 195.92]}
                            position={[0, 0, 0]}
                            url={holoUrl}
                            materialProps={newMaterial}
                        />
                    </Suspense>
                ) : (
                    <Html center>Loading Model...</Html>
                )}
                <OrthographicCamera makeDefault />
                <OrbitControls ref={controlsRef} />
            </Canvas>
        </div>
    );
};

export default ShipHolo;
