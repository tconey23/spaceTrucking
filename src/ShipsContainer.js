import React, {useEffect, useState} from 'react'
import ShipHolo from './ShipHolo'

const ShipsContainer = ({veh, holoPath}) => {
const [holo, setHolo] = useState(holoPath)

useEffect(() => {
    console.log(holoPath)
}, [holoPath])

useEffect(() => {
    console.log(holo)
}, [holo])
    
  return (
    <>
        <div className='ship-background'></div>
        <div className='ship-section'>
        <section className='ship-name-acc'>
            <p className='ship-manu'>{veh.manufacturer.name} </p>
            <p className='ship-model'>{veh.name}</p>
            <div className='ship-details'>
                <p>type: {veh.type}</p>
                <p>focus: {veh.focus.toLowerCase()}</p>
                <br/>
                <p>cargo capacity: {veh.capacity}</p>
            </div>
        </section>
            <div className='logo_wrapper'>
                <img className='man-logo' src={veh.manufacturer.logo} alt={veh.manufacturer.name} />
            </div>
        <div className='holo-wrapper'>
            {holoPath && <ShipHolo shipUrl={holoPath}/>}
        </div>
        </div>
    </>
  )
}

export default ShipsContainer
