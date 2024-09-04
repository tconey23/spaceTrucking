import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated, easings } from 'react-spring';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import './Ships.css';
import ShipsContainer from './ShipsContainer';

const Ships = ({ myHangar }) => {
  const [holoPath, setHoloPath] = useState(null);
  const [buttonDims, setButtonDims] = useState();
  const buttonRef = useRef();

  useEffect(() => {
    setHoloPath(null);
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      setButtonDims([`${buttonRef.current.offsetWidth}px`, `30px`]);
    }
  }, [buttonRef.current]);

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
  });

  return (
    <animated.div style={fadeIn} ref={buttonRef}>
      <Accordion
        onChange={(expandedItems) => {
          if (expandedItems.length > 0) {
            const expandedUUID = expandedItems[0]; // Get the UUID of the expanded item
            setHoloPath(expandedUUID);
            console.log('Expanded Accordion UUID:', expandedUUID); // Log the UUID
          } else {
            setHoloPath(null); // Reset holoPath when all accordions are collapsed
            console.log('No Accordion expanded');
          }
        }}
        allowZeroExpanded={true}
        className="ship-accordion"
      >
        {myHangar.map((veh) => (
          <AccordionItem key={veh.id} uuid={veh.holo}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <p className="ship-name">{veh.name}</p>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel
              style={{
                backgroundImage: `url(${veh.image})`,
              }}
            >
              {holoPath === veh.holo && <ShipsContainer veh={veh} holoPath={holoPath} />}
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </animated.div>
  );
};

export default Ships;
