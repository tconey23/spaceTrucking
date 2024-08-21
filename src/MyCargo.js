import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getData } from './apiCalls';
import { customStyles, customStylesSmall } from './dropDownStyles';

const MyCargo = ({ systems }) => {
  const [systemEl, setSystemEl] = useState([]);
  const [systemOpt, setSystemOpt] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [expandedSystems, setExpandedSystems] = useState({});
  const [expandedPlanets, setExpandedPlanets] = useState({});
  const [expandedMoons, setExpandedMoons] = useState({});
  const [expandedOrbits, setExpandedOrbits] = useState({});
  const [expandedOutposts, setExpandedOutposts] = useState({});
  const [expandedStations, setExpandedStations] = useState({});
  const [systemPlanets, setSystemPlanets] = useState({});
  const [planetMoons, setPlanetMoons] = useState({});
  const [planetOrbits, setPlanetOrbits] = useState({});
  const [moonOutposts, setMoonOutposts] = useState({});
  const [selectedPlanets, setSelectedPlanets] = useState({});
  const [selectedMoons, setSelectedMoons] = useState({});

  useEffect(() => {
    const displaySystems = (systems) => {
      let optionArray = systems.map(sys => ({
        value: sys.id,
        label: sys.name,
      }));
      setSystemOpt(optionArray);

      const defaultOptions = optionArray.find((opt) => opt.label === 'Stanton');
      setSelectedOptions([defaultOptions]);
    };

    if (systems) {
      displaySystems(systems);
    }
  }, [systems]);

  useEffect(() => {
    if (selectedOptions.length > 0) {
      const filteredSystems = systems.filter(system =>
        selectedOptions.some(option => option.value === system.id)
      );

      const systemElements = filteredSystems.map(sys => (
        <div className='selected-system' key={sys.id}>
          <span>
            <p className='sys-name'>{sys.name}</p>
            <i
              className={expandedSystems[sys.id] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right"}
              onClick={() => toggleExpandSystem(sys.id)}
            ></i>
          </span>
          {expandedSystems[sys.id] && (
            <div className="system-details">
              <Select
                isMulti
                options={systemPlanets[sys.id] || []}
                value={selectedPlanets[sys.id] || []}
                styles={customStylesSmall}
                onChange={(selected) => handlePlanetChange(selected, sys.id)}
              />
              {selectedPlanets[sys.id] && selectedPlanets[sys.id].length > 0 && selectedPlanets[sys.id].map(planet => (
                <div className='selected-planet' key={planet.value}>
                  <span>
                    <p className='planet-name'>{planet.label}</p>
                    <i
                      className={expandedPlanets[planet.value] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right"}
                      onClick={() => toggleExpandPlanet(planet.value, sys.id)}
                    ></i>
                  </span>
                  {expandedPlanets[planet.value] && (
                    <div className="planet-details">
                      <Select
                        isMulti
                        options={[...(planetMoons[planet.value] || []), ...(planetOrbits[planet.value] || [])]}
                        value={selectedMoons[planet.value] || []}
                        styles={customStylesSmall}
                        onChange={(selected) => handleMoonChange(selected, planet.value)}
                      />
                      {(selectedMoons[planet.value] || []).map(moonOrOrbit => (
                        <div className={`selected-${moonOrOrbit.type}`} key={moonOrOrbit.value}>
                          <span>
                            <p className={`${moonOrOrbit.type}-name`}>{moonOrOrbit.label}</p>
                            <i
                              className={
                                moonOrOrbit.type === 'moon'
                                  ? (expandedMoons[moonOrOrbit.value] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right")
                                  : moonOrOrbit.type === 'station'
                                  ? (expandedStations[moonOrOrbit.value] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right")
                                  : (expandedOrbits[moonOrOrbit.value] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right")
                              }
                              onClick={() =>
                                moonOrOrbit.type === 'moon'
                                  ? toggleExpandMoon(moonOrOrbit.value, sys.id, planet.value)
                                  : moonOrOrbit.type === 'station'
                                  ? toggleExpandStation(moonOrOrbit.value)
                                  : toggleExpandOrbit(moonOrOrbit.value)
                              }
                            ></i>
                          </span>
                          {moonOrOrbit.type === 'moon' && expandedMoons[moonOrOrbit.value] && (
                            <div className="moon-details">
                              {moonOutposts[moonOrOrbit.value] && moonOutposts[moonOrOrbit.value].length > 0 && moonOutposts[moonOrOrbit.value].map(outpost => (
                                <div className='selected-outpost' key={outpost.value}>
                                  <span>
                                    <p className='outpost-name'>{outpost.label}</p>
                                    <i
                                      className={expandedOutposts[outpost.value] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right"}
                                      onClick={() => toggleExpandOutpost(outpost.value)}
                                    ></i>
                                  </span>
                                  {expandedOutposts[outpost.value] && (
                                    <div className="outpost-details">
                                      <p>Details for {outpost.label}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {moonOrOrbit.type === 'station' && expandedStations[moonOrOrbit.value] && (
                            <div className="station-details">
                              <p>Details for {moonOrOrbit.label}</p>
                            </div>
                          )}
                          {moonOrOrbit.type === 'orbit' && expandedOrbits[moonOrOrbit.value] && (
                            <div className="orbit-details">
                              <p>Details for {moonOrOrbit.label}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ));

      setSystemEl(systemElements);
    } else {
      setSystemEl([]);
    }
  }, [selectedOptions, systems, expandedSystems, systemPlanets, selectedPlanets, expandedPlanets, planetMoons, selectedMoons, expandedMoons, moonOutposts, expandedOutposts, planetOrbits, expandedOrbits, expandedStations]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  const toggleExpandSystem = async (systemId) => {
    setExpandedSystems(prevState => ({
      ...prevState,
      [systemId]: !prevState[systemId],
    }));

    if (!expandedSystems[systemId]) {
      const data = await getData(`https://uexcorp.space/api/2.0/planets?id_star_system=${systemId}`);
      const planetOptions = data.data.map(planet => ({
        value: planet.id,
        label: planet.name,
      }));
      setSystemPlanets(prevState => ({
        ...prevState,
        [systemId]: planetOptions,
      }));

      setSelectedPlanets([planetOptions])

      const orbitData = await getData(`https://uexcorp.space/api/2.0/orbits?id_star_system=${systemId}`);
      const orbitOptions = orbitData.data.map(orbit => ({
        value: orbit.id,
        label: orbit.name_origin,
        name: orbit.name,
        type: 'orbit',
        planetName: orbit.name.split(' ')[0],
      }));

      let orbitMapping = {};
      orbitOptions.forEach(orbit => {
        const planet = planetOptions.find(p => orbit.planetName.includes(p.label) && orbit.name.length > orbit.planetName.length);
        if (planet) {
          if (!orbitMapping[planet.value]) orbitMapping[planet.value] = [];
          orbitMapping[planet.value].push(orbit);
        }
      });

      setPlanetOrbits(prevState => ({
        ...prevState,
        ...orbitMapping,
      }));
    }
  };

  const toggleExpandPlanet = async (planetId, systemId) => {
    setExpandedPlanets(prevState => ({
      ...prevState,
      [planetId]: !prevState[planetId],
    }));

    if (!expandedPlanets[planetId]) {
      const data = await getData(`https://uexcorp.space/api/2.0/moons?id_planet=${planetId}`);
      const moonOptions = data.data.map(moon => ({
        value: moon.id,
        label: moon.name,
        type: 'moon',
      }));

      const planetStationData = await getData(`https://uexcorp.space/api/2.0/space_stations?id_star_system=${systemId}&id_planet=${planetId}`);
      const planetStationOptions = planetStationData.data.map(station => ({
        value: station.id,
        label: station.name,
        type: 'station',
      }));

      const cityData = await getData(`https://uexcorp.space/api/2.0/cities?id_star_system=${systemId}&id_planet=${planetId}`);
      const cityOptions = cityData.data.map(city => ({
        value: city.id,
        label: city.name,
        type: 'city',
      }));

      const combinedOptions = [...moonOptions, ...planetStationOptions, ...cityOptions];

      setPlanetMoons(prevState => ({
        ...prevState,
        [planetId]: combinedOptions,
      }));

      setSelectedMoons(prevState => ({
        ...prevState,
        [planetId]: combinedOptions
      }));
    }
  };

  const toggleExpandMoon = async (moonId, systemId, planetId) => {
    setExpandedMoons(prevState => ({
      ...prevState,
      [moonId]: !prevState[moonId],
    }));

    if (!expandedMoons[moonId]) {
      const data = await getData(`https://uexcorp.space/api/2.0/outposts?id_star_system=${systemId}&id_planet=${planetId}&id_moon=${moonId}`);
      const outpostOptions = data.data.map(outpost => ({
        value: outpost.id,
        label: outpost.name,
      }));

      if (outpostOptions.length) {
        setMoonOutposts(prevState => ({
          ...prevState,
          [moonId]: outpostOptions,
        }));
      } else {
        toggleExpandOutpost(moonId);
      }
    }
  };

  const toggleExpandOrbit = (orbitId) => {
    setExpandedOrbits(prevState => ({
      ...prevState,
      [orbitId]: !prevState[orbitId],
    }));
  };

  const toggleExpandOutpost = (outpostId) => {
    setExpandedOutposts(prevState => ({
      ...prevState,
      [outpostId]: !prevState[outpostId],
    }));
  };

  const toggleExpandStation = (stationId) => {
    setExpandedStations(prevState => ({
      ...prevState,
      [stationId]: !prevState[stationId],
    }));
  };

  const handlePlanetChange = (selected, systemId) => {
    setSelectedPlanets(prevState => ({
      ...prevState,
      [systemId]: selected,
    }));
  };

  const handleMoonChange = (selected, planetId) => {
    setSelectedMoons(prevState => ({
      ...prevState,
      [planetId]: selected,
    }));
  };

  return (
    <>
      <div>
        <Select
          isMulti
          options={systemOpt}
          value={selectedOptions}
          styles={customStyles}
          onChange={handleChange}
        />
      </div>
      <div className='systems-list'>
        {systemEl}
      </div>
    </>
  );
};

export default MyCargo;
