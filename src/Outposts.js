import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import CargoRecord from './CargoRecord';

const Outposts = ({planet, system, orbit, token}) => {

    const [selectedPlanet, setSelectedPlanet] = useState(planet)
    const [selectedSystem, setSelectedSystem] = useState(system)
    const [selectedOrbit, setSelectedOrbit] = useState(orbit)
    const [stations, setStations] = useState()
    const [selectedStation, setSelectedStation] = useState()
    const [keyId, setKeyId] = useState(1)

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

    const getOutposts = async (orbitId) => {
        const res = await getData(
          `outposts?id_star_system=${selectedSystem.id}&id_moon=${orbitId}`
        );
        const stat = await getData(
          `space_stations?id_star_system=${selectedSystem.id}&id_orbit=${orbitId}`
        );
    
        const mergedArray = [...res, ...stat];
        setStations(mergedArray);
      };

      const stationSelected = (station) => {
        setSelectedStation(station)
      }

    useEffect(() => {
        planet && setSelectedPlanet(planet)
    }, [])

    const updateKey = async () => {
      await setKeyId(prev => prev + 2)
      return
    }

    useEffect(() => {
        selectedPlanet && selectedOrbit && getOutposts(selectedOrbit.id)
        updateKey()
    }, [selectedPlanet,  selectedOrbit])

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={['selectedPlanet', 'selectedSystem']}>
      {stations && !selectedStation && stations.map((station) => (
        <AccordionItem key={station.id} onClick={() => stationSelected(station)} id='outpostItem'>
          <AccordionItemHeading>
            <AccordionItemButton>
              {station.name}
            </AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
      ))}
      {selectedStation && 
        <>
            <AccordionItem id='outpostItem'>
                <AccordionItemHeading>
                    <AccordionItemButton>
                        {selectedStation.name}
                        <i className="fi fi-sr-undo return-button" onClick={() => setSelectedStation('')}></i>
                    </AccordionItemButton>
                </AccordionItemHeading>
            </AccordionItem>
                <AccordionItemPanel>
                    <CargoRecord keyId={keyId} setKeyId={setKeyId} token={token} planet={planet} system={system} orbit={selectedOrbit} station={selectedStation}/>
                </AccordionItemPanel>
        </>
        }
  </Accordion>
  )
}

export default Outposts
