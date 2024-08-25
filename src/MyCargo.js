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

const MyCargo = () => {
  const [systems, setSystems] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [planets, setPlanets] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState();
  const [moons, setMoons] = useState({});
  const [selectedMoon, setSelectedMoon] = useState();
  const [renderedMoons, setRenderedMoons] = useState();
  const [expandedPlanets, setExpandedPlanets] = useState({});
  const [stations, setStations] = useState();
  const [renderedStations, setRenderedStations] = useState();
  const [selectedStation, setSelectedStation] = useState()

  const path = 'https://uexcorp.space/api/2.0/';

  const getData = async (endpoint) => {
    try {
      const res = await fetch(`${path}${endpoint}`);
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    const loadSystems = async () => {
      const res = await getData('star_systems');
      setSystems(res);
    };

    loadSystems();
  }, []);

  const getPlanets = async (systemId) => {
    setSelectedSystem(systemId);
    const res = await getData(`planets?id_star_system=${systemId}`);
    setPlanets(res);
    setMoons({});
  };

  const handleOrbitClick = (pln, orb) => {
    setSelectedMoon(orb);
    getOutposts(pln, orb);
  };

  const renderStations = (stat) => {
    const stationEl = stat.map((st) => (
      <AccordionItem key={st.id} onClick={setSelectedStation(st.name)}>
        <AccordionItemHeading >
          <AccordionItemButton>{st.name}</AccordionItemButton>
        </AccordionItemHeading>
        {selectedStation && 
          <p>{st.name}</p>
        }
      </AccordionItem>
    ));
    setRenderedStations(stationEl);
  };

  const renderMoons = (data, planetId) => {
    const mapData = data.map((moon) => (
      <Accordion key={moon.id}>
        {selectedPlanet && (
          <AccordionItem key={moon.id} onClick={() => handleOrbitClick(planetId, moon.id)}>
            <AccordionItemHeading>
              <AccordionItemButton>{moon.name}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {renderedStations && renderedStations}
            </AccordionItemPanel>
          </AccordionItem>
        )}
      </Accordion>
    ));
    setRenderedMoons(mapData);
  };

  const getMoons = async (planetId, planetName) => {
    const res = await getData(`moons?id_star_system=${selectedSystem}&id_planet=${planetId}`);
    const orb = await getData(`orbits?id_star_system=${selectedSystem}`);
    const filterOrb = orb.filter((orb) => orb.name !== planetName);

    const strLength = (str) => {
      const trimmedOrb = str.trim();
      const wordArray = trimmedOrb.split(/\s+/);
      return wordArray.length;
    };

    const filterFilter = filterOrb.filter(
      (orb) => strLength(orb.name) > 1 && orb.name.toLowerCase().includes(planetName.toLowerCase())
    );

    const filterMap = filterFilter.map((orb) => ({
      id: orb.id,
      id_star_system: orb.id_star_system,
      id_planet: null,
      id_orbit: orb.id,
      name: orb.name_origin,
    }));

    const mergedArray = [...res, ...filterMap];

    renderMoons(mergedArray, planetId);
  };

  const handlePlanetClick = (planetId, planetName) => {
    setSelectedPlanet(planetId);
    setExpandedPlanets((prevExpanded) => ({
      ...prevExpanded,
      [planetId]: !prevExpanded[planetId],
    }));
    getMoons(planetId, planetName);
  };

  const getOutposts = async (pln, orb) => {
    const res = await getData(`outposts?id_star_system=${selectedSystem}&id_moon=${orb}`);
    const stat = await getData(`space_stations?id_star_system=${selectedSystem}&id_orbit=${orb}`);

    const mergedArray = [...res, ...stat];
    setStations(mergedArray);
    renderStations(mergedArray);
  };

  useEffect(() => {
    console.log(selectedPlanet);
  }, [selectedPlanet]);

  useEffect(() => {
    if (stations) {
      console.log(stations);
    }
  }, [stations]);

  return (
    <div className='acc-wrapper'>
      <Accordion>
        {systems &&
          systems.map((system) => (
            <AccordionItem key={system.id} onClick={() => getPlanets(system.id)}>
              <AccordionItemHeading>
                <AccordionItemButton>{system.name}</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {planets &&
                  planets.map((planet) => (
                    <Accordion key={`planet${planet.id}`}>
                      <AccordionItem
                        key={`planet${planet.id}`}
                        onClick={() => {
                          setSelectedPlanet(planet.id);
                          handlePlanetClick(planet.id, planet.name);
                        }}
                      >
                        <AccordionItemHeading>
                          <AccordionItemButton>{planet.name}</AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                          {renderedMoons && selectedPlanet && <>{renderedMoons}</>}
                        </AccordionItemPanel>
                      </AccordionItem>
                    </Accordion>
                  ))}
              </AccordionItemPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
};

export default MyCargo;
