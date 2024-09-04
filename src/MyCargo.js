import React, { useState, useEffect, useRef } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState
} from 'react-accessible-accordion';
import Planets from './Planets';

const MyCargo = ({token}) => {
  const [storedSystems, setStoredSystems] = useState();
  const [favSystems, setFavSystems] = useState([]);
  const [systems, setSystems] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);

  const path = 'https://uexcorp.space/api/2.0/';

  useEffect(() => {
    const loadSystems = async () => {
      const res = await getData('star_systems');
      setSystems(res);
    };
    loadSystems();

    let favs = localStorage.getItem('favorite_systems');

    const setNewFavs = () => {
      localStorage.setItem('favorite_systems', JSON.stringify([]));
    };

    const getFavs = () => {
      let sfavs = JSON.parse(localStorage.getItem('favorite_systems') || '[]');
      sfavs.length > 0 && setFavSystems(sfavs);
    };

    favs === null ? setNewFavs() : getFavs();
  }, []);

  useEffect(() => {

    const updateLocalFavs = () => {
      localStorage.setItem('favorite_systems', JSON.stringify(favSystems))
    }


    updateLocalFavs ()
  }, [favSystems])

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

  const handleFavs = async (event, type, sysId) => {
    event.stopPropagation();
    if (type === 'add') {
      await setFavSystems((prev) => [...prev, sysId]);
      console.log(favSystems)
    } else {
      let remFav = favSystems.filter((sys) => sys !== sysId);
      console.log(sysId)
      setFavSystems(remFav);
    }
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
                <i
                  style={{ color: 'orange', zIndex: 500, position: 'relative' }}
                  className="fi fi-sr-star"
                  onClick={(event) => handleFavs(event, 'rem', system.id)}
                ></i>
              ) : (
                <i
                  style={{ color: 'black', zIndex: 500, position: 'relative' }}
                  className="fi fi-rr-star"
                  onClick={(event) => handleFavs(event, 'add', system.id)}
                ></i>
              )}
            </span>
          </AccordionItemButton>
        </AccordionItemHeading>
      </AccordionItem>
    ));
  };

  return (
    <div className="acc-wrapper">
      <Accordion id='cargoAccordion' allowMultipleExpanded>
        {systems && !selectedSystem && renderSystems()}

        {selectedSystem && (
          <Planets
          token={token}
            setSelectedSystem={setSelectedSystem}
            system={systems.find((sys) => sys.id === selectedSystem)}
          />
        )}
      </Accordion>
    </div>
  );
};

export default MyCargo;
