import React from 'react'
import ShipHolo from './ShipHolo'

const HoloTest = () => {
    console.log('holo test')
    const path = `https//cdn.fleetyards.net%2Fuploads%2Fmodel%2Fholo%2F91%2F43%2F8ac5-6ec9-4e07-b5cf-f7bd8965520c%2Fholo-5d3aba1c-0596-4bb1-b39f-c1702b21a597.gltf`
  return (
    <div>
      <ShipHolo shipUrl={`http://localhost:5000/fetch-gltf?url=${encodeURIComponent(path)}`}/>
    </div>
  )
}

export default HoloTest
