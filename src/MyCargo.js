import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Planets from './Planets';

const MyCargo = () => {
  const [favSystems, setFavSystems] = useState([68]);
  const [systems, setSystems] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);

  const path = 'https://uexcorp.space/api/2.0/';

  useEffect(() => {
    const loadSystems = async () => {
      const res = await getData('star_systems');
      setSystems(res);
    };
    loadSystems();
  }, []);

  const getData = async (endpoint) => {
    try {
      const res = await fetch(`${path}${endpoint}`);
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return [];
    }
  };

  const handleSystemClick = (systemId) => {
    setSelectedSystem(systemId);
  };

  const sortedSystems = systems
    ? [
        ...systems.filter((system) => favSystems.includes(system.id)),
        ...systems.filter((system) => !favSystems.includes(system.id)),
      ]
    : [];

  const renderSystems = () => {
    return sortedSystems.map((system) => (
      <AccordionItem key={system.id} onClick={() => handleSystemClick(system.id)}>
        <AccordionItemHeading>
          <AccordionItemButton>
            <span>
              {system.name}
              {favSystems.includes(system.id) ? (
                <i style={{ color: 'orange' }} className="fi fi-sr-star"></i>
              ) : (
                <i style={{ color: 'black' }} className="fi fi-rr-star"></i>
              )}
            </span>
          </AccordionItemButton>
        </AccordionItemHeading>
      </AccordionItem>
    ));
  };

  return (
    <div className="acc-wrapper">
      <Accordion allowMultipleExpanded>
        {systems && !selectedSystem && renderSystems()}

        {selectedSystem && (
                <Planets setSelectedSystem={setSelectedSystem} system={systems.find((sys) => sys.id === selectedSystem)} />
        )}
      </Accordion>
    </div>
  );
};

export default MyCargo;
