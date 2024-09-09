import React, { useState, useEffect, useRef, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, OrthographicCamera } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './Loading.css';
import { useSpring, animated, easings } from 'react-spring';
import { GlobalContext } from './GlobalContext';

const Loading = () => {

    const [gltfUrl, setGltfUrl] = useState(null);
    const controlsRef = useRef();
    const canvasRef = useRef();
    const [windowDims, setWindowDims] = useState()
    const wrapperRef = useRef()
    const newMaterial = new THREE.MeshPhysicalMaterial({
        color: '#00a2ff',
    });
    const { devProd } = useContext(GlobalContext)

    const fadeIn = useSpring({
        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        },
        config: {
            duration: 1500,
            easing: easings.easeInOutCubic,
          },
      })
    

    useEffect(() => {
        const fetchGltf = async () => {
            try {
                const response = await fetch(`${devProd}fetch-loading-gltf`);
                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setGltfUrl(url);
                } else {
                    console.error('Failed to fetch GLTF:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching GLTF:', error);      
            }
        };

        fetchGltf();
    }, [devProd]);



    useEffect(() => {

        if(wrapperRef.current) {
            setWindowDims([window.innerHeight / 2, window.innerWidth / 2])
        }




    }, [wrapperRef.current])

    return (
        <animated.div className='loading-wrapper' ref={wrapperRef} style={fadeIn}>
            {windowDims && <h3 style={{top: windowDims[0] - 200, left: windowDims[1] - 70}}>Loading</h3>}
            <animated.div style={fadeIn} className='canvas-test-wrapper'>
            {gltfUrl && ( <Canvas ref={canvasRef} style={{ width: '50%', height: '50%', background: 'black' }}>
                    <directionalLight intensity={100} position={[10, 10, 10]} color={'#00a2ff'} />
                        <Model
                            zoom={5.4}
                            cameraPosition={[-218, 109, 196]}
                            position={[0, 0, 0]}
                            url={gltfUrl}
                            materialProps={newMaterial}
                        />
                    <OrthographicCamera />
                    <OrbitControls ref={controlsRef} />
                </Canvas>
                    )}
            </animated.div>
        </animated.div>
    );
};

export default Loading;

function Model({ url, position, cameraPosition, zoom, color = 'orange', materialProps = {} }) {
    const { camera } = useThree();
    const holoRef = useRef();
    const { scene } = useGLTF(url);

    useEffect(() => {
        camera.position.set(...(cameraPosition || [0, 0, 5]));
        camera.zoom = zoom || 1;
        camera.updateProjectionMatrix();
    }, [camera, cameraPosition, zoom]);

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
