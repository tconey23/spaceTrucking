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
import CargoRecord from './CargoRecord';

const Outposts = ({planet, system, orbit}) => {

    const [selectedPlanet, setSelectedPlanet] = useState(planet)
    const [selectedSystem, setSelectedSystem] = useState(system)
    const [selectedOrbit, setSelectedOrbit] = useState(orbit)
    const [stations, setStations] = useState()
    const [selectedStation, setSelectedStation] = useState()

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
        console.log(orbitId)
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

    useEffect(() => {
        selectedPlanet && selectedOrbit && getOutposts(selectedOrbit.id)
    }, [selectedPlanet,  selectedOrbit])

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={['selectedPlanet', 'selectedSystem']}>
      {stations && !selectedStation && stations.map((station) => (
        <AccordionItem key={station.id} onClick={() => stationSelected(station)}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {station.name}
            </AccordionItemButton>
          </AccordionItemHeading>
        </AccordionItem>
      ))}
      {selectedStation && 
        <>
            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton>
                        {selectedStation.name}
                        <button className='return-button' onClick={() => setSelectedStation('')}>X</button>
                    </AccordionItemButton>
                </AccordionItemHeading>
            </AccordionItem>
                <AccordionItemPanel>
                    <CargoRecord planet={planet} system={system} orbit={selectedOrbit} station={selectedStation}/>
                </AccordionItemPanel>
        </>
        }
  </Accordion>
  )
}

export default Outposts
