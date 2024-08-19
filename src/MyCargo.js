import React, { useState, useEffect } from 'react';
import AddCargo from './AddCargo';
import { animated, useSpring } from '@react-spring/web'

const MyCargo = ({ cargoRecords, onCargoSubmit }) => {

  const [dataTree, setDataTree] = useState([]);
  const [systems, setSystems] = useState([]);
  const [displayOrbits, setDisplayOrbits] = useState({ 68: true });
  const [displayCargo, setDisplayCargo] = useState({});
  const [addCargo, setAddCargo] = useState();

  const rotation = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(180deg)' },
    reverse: true,
  });

  const loadStorage = () => {
    const storedRecords = localStorage.getItem('cargo_records');
    let cargoRecords = [];
    try {
      cargoRecords = JSON.parse(storedRecords) || [];
      setDataTree(cargoRecords);
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
    }
  };

  const toggleOrbits = (systemId) => {
    setDisplayOrbits(prevState => ({
      ...prevState,
      [systemId]: !prevState[systemId]
    }));
  };

  const toggleCargo = (orbitName) => {
    setDisplayCargo(prevState => ({
      ...prevState,
      [orbitName]: !prevState[orbitName]
    }));
  };

  const toggleAddCargo = (orbitName) => {
    setAddCargo(orbitName);
  };

  const deleteCargo = (orbitName, cargoIndex) => {
    const storedRecords = localStorage.getItem('cargo_records');
    let cargoRecords = JSON.parse(storedRecords) || [];

    cargoRecords.forEach((system) => {
      system.system.orbits.forEach((orbit) => {
        if (orbit.orbit_name === orbitName) {
          orbit.stored_cargo.splice(cargoIndex, 1); 
        }
      });
    });

    localStorage.setItem('cargo_records', JSON.stringify(cargoRecords));

    loadStorage();
  };

  useEffect(() => {
    loadStorage();
  }, []);

  useEffect(() => {
    const displayTree = () => {
      const systemElements = dataTree.map((sys) => {
        const orbits = sys.system.orbits.map((orb) => (
          
          <div className='orbits' key={orb.orbit_name}>
            <span className='orbit-span' key={orb.id}>
              <h2>{orb.orbit_name}</h2>
              <i
                className="fi fi-sr-caret-square-down"
                onClick={() => {
                  toggleCargo(orb.orbit_name)
                  
                }}>
              </i>
            </span>
            {displayCargo[orb.orbit_name] && (
              <div className='cargo-wrapper'>
                <div>
                  <p>Add Cargo <i className="fi fi-sr-add" onClick={() => {
                    toggleAddCargo(orb.orbit_name) 
                    
                    }}></i></p>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Commodity</th>
                      <th>SCU</th>
                      <th>Actions</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {orb.stored_cargo && orb.stored_cargo.map((cargo, index) => (
                      <tr key={index}>
                        <td>{cargo.commodity}</td>
                        <td>{cargo.stored_amount}</td>
                        <td>
                          <i
                            className="fi fi-sr-trash"
                            onClick={() => deleteCargo(orb.orbit_name, index)} 
                            >
                          </i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
          </div>
        ));

        return (
          <div className='system' key={sys.system.id}>
            <span className='system-span'>
              <h1>{sys.system.name}</h1>
              <i
                className="fi fi-sr-caret-square-down"
                onClick={() => toggleOrbits(sys.system.id)}
              ></i>
            </span>
            <div className='orbit-wrapper'>
              {displayOrbits[sys.system.id] && orbits}
            </div>
          </div>
        );
      });
      setSystems(systemElements);
    };

    if (dataTree.length > 0) {
      displayTree();
    }
  }, [dataTree, displayOrbits, displayCargo]);



  return (
    <div className='systems-list'>
      {systems}
      {addCargo && 
      <div className='cargo-menu'>
        <AddCargo location={addCargo} setAddCargo={setAddCargo} onCargoSubmit={onCargoSubmit}/>
      </div>
      }
    </div>
  );
};

export default MyCargo;
