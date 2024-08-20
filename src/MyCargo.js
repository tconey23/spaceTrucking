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
                        options={planetMoons[planet.value] || []}
                        value={selectedMoons[planet.value] || []}
                        styles={customStylesSmall}
                        onChange={(selected) => handleMoonChange(selected, planet.value)}
                      />
                      {selectedMoons[planet.value] && selectedMoons[planet.value].length > 0 && selectedMoons[planet.value].map(moon => (
                        <div className='selected-moon' key={moon.value}>
                          <span>
                            <p className='moon-name'>{moon.label}</p>
                            <i
                              className={expandedMoons[moon.value] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right"}
                              onClick={() => toggleExpandMoon(moon.value, sys.id)}
                            ></i>
                          </span>
                          {expandedMoons[moon.value] && (
                            <div className="moon-details">
                              {moonOutposts[moon.value] && moonOutposts[moon.value].length > 0 && moonOutposts[moon.value].map(outpost => (
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
                                      {/* Render outpost-specific details here */}
                                      <p>Details for {outpost.label}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {planetOrbits[planet.value] && planetOrbits[planet.value].length > 0 && planetOrbits[planet.value].map(orbit => (
                        <div className='selected-orbit' key={orbit.value}>
                          <span>
                            <p className='orbit-name'>{orbit.label}</p>
                            <i
                              className={expandedOrbits[orbit.value] ? "fi fi-sr-caret-circle-down" : "fi fi-sr-caret-circle-right"}
                              onClick={() => toggleExpandOrbit(orbit.value)}
                            ></i>
                          </span>
                          {expandedOrbits[orbit.value] && (
                            <div className="orbit-details">
                              {/* Render orbit-specific details here */}
                              <p>Details for {orbit.label}</p>
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
  }, [selectedOptions, systems, expandedSystems, systemPlanets, selectedPlanets, expandedPlanets, planetMoons, selectedMoons, expandedMoons, moonOutposts, expandedOutposts, planetOrbits, expandedOrbits]);

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

      const defaultPlanets = planetOptions.filter(opt => opt.label === 'ArcCorp' || opt.label === 'Hurston');
      setSelectedPlanets(prevState => ({
        ...prevState,
        [systemId]: defaultPlanets,
      }));

      // Fetch orbits after planets
      const orbitData = await getData(`https://uexcorp.space/api/2.0/orbits?id_star_system=${systemId}`);
      console.log(orbitData)
      const orbitOptions = orbitData.data.map(orbit => ({
        value: orbit.id,
        label: orbit.name_origin,
        name: orbit.name,
        planetName: orbit.name.split(' ')[0], // Assuming the orbit's planet name is the first word
      }));

      let orbitMapping = {};
      orbitOptions.forEach(orbit => {
        const planet = planetOptions.find(p => orbit.planetName.includes(p.label) && orbit.name.includes(''));
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
      }));
      setPlanetMoons(prevState => ({
        ...prevState,
        [planetId]: moonOptions,
      }));

      setSelectedMoons(prevState => ({
        ...prevState,
        [planetId]: moonOptions,
      }));
    }
  };

  const toggleExpandMoon = async (moonId, systemId) => {
    setExpandedMoons(prevState => ({
      ...prevState,
      [moonId]: !prevState[moonId],
    }));

    if (!expandedMoons[moonId]) {
      const data = await getData(`https://uexcorp.space/api/2.0/outposts?id_star_system=${systemId}&id_moon=${moonId}`);
      const outpostOptions = data.data.map(outpost => ({
        value: outpost.id,
        label: outpost.name,
      }));
      setMoonOutposts(prevState => ({
        ...prevState,
        [moonId]: outpostOptions,
      }));
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
