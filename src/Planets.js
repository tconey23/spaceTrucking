import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Orbits from './Orbits';

const Planets = ({ token, system, setSelectedSystem }) => {
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const path = 'https://uexcorp.space/api/2.0/';

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

  const getPlanets = async (systemId) => {
    const res = await getData(`planets?id_star_system=${systemId}`);
    setPlanets(res);
  };

  const planetSelected = (planet) => {
    setSelectedPlanet(planet);
  };

  useEffect(() => {
    if (system) {
      getPlanets(system.id);
    }
  }, [system]);

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={['selectedPlanet', 'selectedSystem']}>
        <AccordionItem uuid="selectedSystem">
            <AccordionItemButton>
                {system.name}
                <i className="fi fi-sr-undo return-button" onClick={() => setSelectedSystem('')}></i>
              </AccordionItemButton>
            </AccordionItem>
      {planets.length > 0 && !selectedPlanet && planets.map((planet) => (
        <AccordionItem key={planet.id} onClick={() => planetSelected(planet)}>
          <AccordionItemHeading>
            <AccordionItemButton>
                <>
                    {planet.name}
                    
                </>
            </AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
      ))}

      {selectedPlanet && (
        <Accordion preExpanded={['selectedPlanet', 'selectedSystem']}>
          <AccordionItem uuid="selectedPlanet">
            <AccordionItemHeading>
              <AccordionItemButton>
                {selectedPlanet.name}
                <i className="fi fi-sr-undo return-button" onClick={() => setSelectedSystem('')}></i>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <Orbits token={token} planet={selectedPlanet} system={system}/>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      )}
    </Accordion>
  );
};

export default Planets;
