import React, {useState, useEffect, Suspense} from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

const ShipHolo = ({ holoUrl }) => {
    console.log(holoUrl)
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={<Html>Loading...</Html>}>
            {holoUrl && 
                <Model url={holoUrl} />
            }
            </Suspense>
            <OrbitControls />
        </Canvas>
    );
}

export default ShipHolo;