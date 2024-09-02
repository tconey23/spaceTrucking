import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import './Ships.css'
import ShipHolo from './ShipHolo';

const Ships = ({ myHangar }) => {
    const [holoPath, setHoloPath] = useState(null);

    const handleHoloClick = (path) => {
        setHoloPath(path);
    };

    useEffect(() => {
        if (holoPath) {
            
        }
    }, [holoPath]);

  return (
    <Accordion allowZeroExpanded={true} className='ship-accordion'>
      {myHangar.map((veh) => (
        <AccordionItem key={veh.id} >
          <AccordionItemHeading>
            <AccordionItemButton>
                <button onClick={() => handleHoloClick(veh.holo)}/>
                <p className='ship-name'>{veh.name}</p>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            style={{
              backgroundImage: `url(${veh.image})`,
            }}
          >
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
          </AccordionItemPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Ships;
