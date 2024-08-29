import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Outposts from './Outposts';

const Orbits = ({planet, system}) => {

    const [selectedPlanet, setSelectedPlanet] = useState()
    const [orbits, setOrbits] = useState()
    const [selectedOrbit, setSelectedOrbit] = useState()
    const [selectedSystem, setSelectedSystem] = useState(system)

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

    const orbitSelected = async (orbit) => {
        await setSelectedOrbit(orbit)
    }

    const getMoons = async (planetId, planetName) => {
        console.log(planetId, planetName)
        const res = await getData(
          `moons?id_star_system=${selectedSystem.id}&id_planet=${planetId}`
        );
        const orb = await getData(`orbits?id_star_system=${selectedSystem.id}`);
        const filterOrb = orb.filter((orb) => orb.name !== planetName);
    
        const filterFilter = filterOrb.filter(
          (orb) =>
            orb.name.trim().split(/\s+/).length > 1 &&
            orb.name.toLowerCase().includes(planetName.toLowerCase())
        );
    
        const filterMap = filterFilter.map((orb) => ({
          id: orb.id,
          id_star_system: orb.id_star_system,
          id_planet: null,
          id_orbit: orb.id,
          name: orb.name_origin,
        }));
    
        const mergedArray = [...res, ...filterMap];
        console.log(selectedSystem)
        setOrbits(mergedArray)
      };

    useEffect(() => {
        planet && setSelectedPlanet(planet)
    }, [])

    useEffect(() => {
        console.log(selectedOrbit)
    }, [selectedOrbit])

    useEffect(() => {
        selectedPlanet && getMoons(selectedPlanet.id, selectedPlanet.name)
    }, [selectedPlanet])

  return (
    <Accordion className='orbit-accordion' allowMultipleExpanded allowZeroExpanded preExpanded={['selectedPlanet', 'selectedSystem']}>
      {orbits && !selectedOrbit && orbits.map((orbit) => (
        <AccordionItem key={orbit.id} onClick={() => orbitSelected(orbit)}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {orbit.name}
              <i class="fi fi-sr-undo return-button" onClick={() => setSelectedSystem('')}></i>
            </AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
      ))}
        {selectedOrbit && 
        <>
            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton>
                        {selectedOrbit.name}
                        <i class="fi fi-sr-undo return-button" onClick={() => setSelectedSystem('')}></i>
                    </AccordionItemButton>
                </AccordionItemHeading>
            </AccordionItem>
                <AccordionItemPanel>
                    <Outposts planet={planet} system={system} orbit={selectedOrbit}/>
                </AccordionItemPanel>
        </>
        }
  </Accordion>
  )
}

export default Orbits
